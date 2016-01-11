/**
 * Pack Script
 * @author: SimonHao
 * @date:   2015-12-19 15:23:32
 */

'use strict';

var path   = require('path');
var fs     = require('fs');
var glob   = require('glob');
var efs    = require('fs-extra');
var page   = require('../../page');
var config = require('../../config');
var file   = require('../../file');

var made_script = require('made-script');
var made_view   = require('made-view');
var made_pack   = require('made-pack-script');

var comm_options = config.get('comm');
var pack_config  = config.get('pack/script');

var script_transform = {
  __src: function(args, options){
    var file_info = file.search(args[0], {
      basedir: options.basedir,
      filename: options.filename,
      entry: '',
      ext: ''
    });

    if(file_info){
      return file_info.url();
    }else{
      console.error('No find file: "', args[0], '" from file', options.filename);
      return args[0];
    }
  }
};

var template_transform = {
  src: function(val, tag, options){
    var file_info;

    if(val.substring(0, 4) === 'http'){
      return val;
    }

    file_info = file.search(val, options)

    if(file_info){
      return file_info.url();
    }else{
      console.error('No find file: "', val, '" from file', options.filename);
      return val;
    }
  }
};

var transform = {
  'js': function(filename){
    var result = made_script.compile_file(filename, {
      basedir: comm_options.path.base,
      entry: comm_options.script.entry,
      ext: comm_options.script.ext,
      func: script_transform
    });

    return result;
  },
  'tpl': function(filename){
    var result = made_view.compile_client_file(filename, {
      basedir: comm_options.path.base,
      entry: comm_options.template.entry,
      ext: comm_options.template.ext
    }, template_transform);

    return result;
  }
};

function find_external(pack_name){
  var external_list = [];

  if(pack_name in pack_config){
    external_list = external_list.concat(pack_config[pack_name].entry || []);
    external_list = external_list.concat(pack_config[pack_name].require || []);
  }

  return external_list;
}

function pack_external(pack_name, page_name){
  var entry = [];
  var require = [];
  var external = [];

  if(pack_name in pack_config){
    entry = pack_config[pack_name].entry || [];
    require = pack_config[pack_name].require || [];

    if(Array.isArray(pack_config[pack_name].external)){
      pack_config[pack_name].external.forEach(function(pack_name){
        external = external.concat(find_external(pack_name));
      });
    }
  }

  return made_pack({
    basedir: comm_options.path.base,
    entry: comm_options.script.entry,
    ext: comm_options.script.ext,
    require: require,
    add: entry,
    external: external
  }, transform);
}

function pack_module(module_list, external_pack_list, page_name){
  var external_list = [];

  external_pack_list.forEach(function(pack_name){
    external_list = external_list.concat(find_external(pack_name));
  });

  return made_pack({
    basedir: comm_options.path.base,
    entry: comm_options.script.entry,
    ext: comm_options.script.ext,
    require: module_list,
    external: external_list,
  }, transform);
}

function pack_page(file_name){
  var page_info = page.set(file_name);

  var external_script = page_info.external_script;
  Object.keys(external_script).forEach(function(pack_name){
    var pack_file_info = file.set(external_script[pack_name]);

    if(!pack_file_info._build){
      pack_file_info._build = true;
      efs.outputFileSync(pack_file_info.dist(), pack_external(pack_name, file_name));
    }
  });

  var page_script_info = file.set(page_info.page_script);
  efs.outputFileSync(page_script_info.dist(), pack_module(page_info.script_module(), Object.keys(external_script), file_name));
}

module.exports = function(build_path, model, done){
  var page_path = path.join(build_path, '/page');
  var page_regx = '**/*' + comm_options.view.ext;
  var files;

  if(fs.existsSync(page_path) && fs.statSync(page_path).isDirectory()){
    files = glob.sync(page_regx, {
      cwd: page_path,
      realpath: true
    });

    files.forEach(function(file_name){
      pack_page(file_name);
    });
  }

  done();
};