/**
 * 从模块中获取View模块
 * @author: SimonHao
 * @date:   2015-11-03 10:59:59
 */

'use strict';

/*var mod    = require('../../module');*/
var config = require('made-config');
var file = require('made-build-file');
var mid    = require('made-id');
var extend = require('extend');
var fs     = require('fs');
var made   = require('made-view');

/**
 * 获取模块中拥有view的模块的信息
 * @param  {Object} module_info 模块信息
 * @return {Array}              视图信息
 */
function get_view_info(module_info, page_src){
    var view_info   = extend({}, module_info, {modules: []});
    var sub_modules = module_info.modules || [];

    sub_modules.forEach(function(sub_module_info){
      var module_path = mid.path(sub_module_info.id, {
        basedir: config.options.basedir,
        entry: 'view.jade',
        ext: '.jade',
        filename: page_src
      });

      if(fs.existsSync(module_path)){
        view_info.modules.push(get_view_info(sub_module_info, page_src));
      }else{
        view_info.modules = view_info.modules.concat(get_view_info(sub_module_info, page_src).modules);
      }
    });

    return view_info;
}

exports.info = function(page_info){
  return mod.format(get_view_info(page_info.module(), page_info.dist()));
};

exports.spage = function(page_info){
};

/**
 * 将view信息转换为适合编译的信息
 * @param  {Object} view_info view信息
 * @return {Object}           编译信息
 */
function get_compile_info(view_info){
  var compile_info = extend({}, view_info, {modules: null});

  if(Array.isArray(view_info.modules) && view_info.modules.length > 0){
      compile_info.modules = {};

      view_info.modules.forEach(function(sub_module_info){
          compile_info.modules[sub_module_info.block] = compile_info.modules[sub_module_info.block] || [];
          compile_info.modules[sub_module_info.block].push(get_compile_info(sub_module_info));
      });
  }

  return compile_info;
};

/**
 * 从一个对象中获取属性节点
 */
function get_options_node(config){
  var options = [];
  var config  = config || {};

  Object.keys(config).forEach(function(name){
    options.push({
      name: name,
      val: JSON.stringify(config[name]),
      type: 'expression'
    });
  });

  return options;
}

/**
 * 生成一个extends node
 */
function get_extends_node(compile_info){
  var extends_node = {
    type: 'extends',
    options: get_options_node(compile_info.config),
    id: compile_info.id + (compile_info.instance ? '!' + compile_info.instance : '!'),
    nodes: []
  };

  return extends_node;
}

/**
 * 生成一个include node
 */
function get_include_node(compile_info){
  var include_node = {
    type: 'include',
    options: get_options_node(compile_info.config),
    id: compile_info.id + (compile_info.instance ? '!' + compile_info.instance : '!')
  };
  return include_node;
}

/**
 * 从编译信息中构建Made模板
 * @param  {Object} compile_info 编译信息
 * @return {String}              编译模板
 */
function get_compile_ast(compile_info){
  var ast_node;

  if(compile_info.modules){
    ast_node = get_extends_node(compile_info);

    Object.keys(compile_info.modules).forEach(function(block){
      var replace_node = {
        type: 'replace',
        position: block,
        nodes: []
      };

      compile_info.modules[block].forEach(function(sub_module_info){
        replace_node.nodes.push(get_compile_ast(sub_module_info));
      });

      ast_node.nodes.push(replace_node);
    });
  }else{
    ast_node = get_include_node(compile_info);
  }

  return ast_node;
};

exports.render = function(view_info){
  var compile_info = get_compile_info(view_info);
  var compile_ast  = get_compile_ast(compile_info);

  var document_ast = {
    type: 'document',
    nodes: [compile_ast],
    line: 0
  };

  var render_func = made.compile_ast(document_ast, {
    basedir: config.options.basedir,
    entry: 'view.jade',
    ext: '.jade',
    filename: ''
  },{
    src: function(str, sid, options){
      var file_info = file.get(str, options);
      if(file_info){
        return file_info.url();
      }else{
        return str;
      }
    }
  });

  return render_func();
};














