/**
 *
 * @author: SimonHao
 * @date:   2015-11-04 15:57:28
 */

'use strict';

var config     = require('../../config.js');
var path       = require('path');
var fs         = require('fs');
var mod        = require('../../module.js');
var file       = require('../../file.js');
var async      = require('async');
var browserify = require('browserify');
var efs        = require('fs-extra');
var mid        = require('made-id');

var script_path = path.join(config.options.distdir, '/temp/script');
var script_pack = config.get('pack/script');

/**
 * 获取模块中的脚本模块
 */
function get_module_script(module_info, page_path){
  var script_info = [];

  var sub_modules = module_info.modules || [];

  sub_modules.forEach(function(sub_module_info){
      script_info = script_info.concat(get_module_script(sub_module_info, page_path));
  });

  var module_path = mid.path(module_info.id, {
    basedir: config.options.basedir,
    entry: 'index.js',
    ext: '.js',
    filename: page_path
  });

  if(fs.existsSync(module_path) && fs.statSync(module_path).isFile()){
    script_info.push({
      id: module_info.id,
      instance: module_info.instance || '',
      options: module_info.options
    });
  }

  return script_info;
}

function get_page_script(page_info){
  var script_info = get_module_script(page_info.module(), page_info.src);

  var script = page_info.info.script || {};

  var before_script = script.before || [];

  before_script.forEach(function(before){
    if(before.id){
      script_info.unshift({
        id: before.id,
        instance: before.instance || '',
        options: before.options || {}
      });
    }
  });

  var after_script = script.after || [];

  after_script.forEach(function(after){
    if(after.id){
      script_info.push({
        id: after.id,
        instance: after.instance || '',
        options: after.options || {}
      });
    }
  });

  return script_info;
}

function pack(entry, require, external, done){

    var bundle = browserify({
        paths: [script_path]
    });

    bundle.add(entry);
    bundle.require(require);
    bundle.external(external);

    bundle.bundle(function(err, script){
        if(err){
            console.error(err.toString());
            //done && done(err, '');
        }else{
            done && done(null, script);
        }
    });
};

function pack_page(page_info, done){
  var script_info = get_page_script(page_info);

  var require_module = script_info.map(function(module_info){
    return module_info.id;
  });

  var external_module = [];

  var external_script = (page_info.info.external && page_info.info.external.script) || [];

  external_script.forEach(function(pack_name){
    var external_info = script_pack[pack_name];

    external_module = external_module.concat(external_info.require || []);
    external_module = external_module.concat(external_info.entry || []);
    external_module = external_module.concat(get_external(external_info));
  });


  pack([], require_module, external_module, done);
}
function get_external(pack_info){
  var external_list = [];

  var external = pack_info.external || [];

  external.forEach(function(pack_name){
    var epack_info = script_pack[pack_name];

    external_list = external_list.concat(epack_info.require || []);
    external_list = external_list.concat(epack_info.entry || []);

    var epack_external = epack_info.external || [];

    epack_external.forEach(function(epack_name){
      external_list = external_list.concat(get_external(script_pack[epack_name] || {}));
    });
  });

  return external_list;
}

function pack_external(pack_name, done){
  var pack_info = script_pack[pack_name] || {};
  var pack_external;

  pack_external = get_external(pack_info);
  pack(pack_info.entry, pack_info.require, pack_external, done);
};

exports.pack = function(page_info, done){
  var external_pack = (page_info.info.external && page_info.info.external.script) || [];

  async.eachSeries(external_pack, function(external, next){
    var src_path = path.join(config.options.basedir, external + '.js');

    if(!file.has(src_path)){
      pack_external(external, function(err, result){
        var file_info = file.set(src_path);

        page_info.script = page_info.script || [];
        page_info.script.push(file_info);

        efs.outputFileSync(file_info.dist(), result);
        next();
      });
    }else{
      next();
    }
  }, function(){
    pack_page(page_info, function(err, result){
      var path_info = path.parse(page_info.src);
      var src_path;

      path_info.base = path_info.name + '.js';
      src_path = path.format(path_info);

      var file_info = file.set(src_path);

      page_info.script = page_info.script || [];
      page_info.script.push(file_info);

      efs.outputFileSync(file_info.dist(), result);
      done();
    });
  });
};

function get_entry_code(page_info){
  var script_info = get_page_script(page_info);

  var code = ['(function(){ function init(module, options, instance){if(module.prototype && module.prototype.__made_module){new module(options, instance)}};'];

  script_info.forEach(function(script_module){
    code.push('init(require(\'' + script_module.id + '\'),' + JSON.stringify(script_module.options) + ',\'' + script_module.instance + '\');');
  });

  code.push('})()');

  return code.join('\n');
};
exports.entry = function(page_info){
  return get_entry_code(page_info);
};