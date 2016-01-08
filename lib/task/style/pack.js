/**
 * Pack Style
 * @author: SimonHao
 * @date:   2015-12-19 15:22:35
 */

'use strict';

var path   = require('path');
var fs     = require('fs');
var glob   = require('glob');
var efs    = require('fs-extra');
var mid    = require('made-id');
var pack   = require('made-pack-style');
var page   = require('../../page');
var config = require('../../config');
var file   = require('../../file');

var comm_options = config.get('comm');
var pack_config  = config.get('pack/style');

var transform = {
  url: function(val, options){
    var src = val[0].replace(/["']/g, '');

    var file_info = file.search(src, {
      basedir: options.basedir,
      filename: options.filename,
      entry: '',
      ext: ''
    });

    if(file_info){
      return 'url(' + file_info.url() + ')';
    }else{
      console.error('Not find file: "', src, '" from file', options.filename);
      return 'url(' + src +')';
    }
  }
};

function find_external(pack_name){
  var external_list = [];

  if(pack_name in pack_config){
    external_list = external_list.concat(pack_config[pack_name].require || []);
  }

  return external_list;
}


function pack_external(pack_name, page_name){
  var require  = [];
  var external = [];

  if(!(pack_name in pack_config)){
    console.error('Cont fine pack "', pack_name, '" from page', page_name);
    return '';
  }

  require = pack_config[pack_name].require || [];

  if(Array.isArray(pack_config[pack_name].external)){
    pack_config[pack_name].external.forEach(function(pack_name){
      external = external.concat(find_external(pack_name));
    });
  }

  return pack({
    basedir: comm_options.path.base,
    filename: page_name,
    entry: comm_options.style.entry,
    ext: comm_options.style.ext,
    require: require,
    external: external
  }, transform);
}

function pack_module(module_list, external_pack_list, page_name){
  var external_list = [];
  var module_list   = module_list || [];

  external_pack_list.forEach(function(pack_name){
    external_list = external_list.concat(find_external(pack_name));
  });

  return pack({
    basedir: comm_options.path.base,
    filename: page_name,
    entry: comm_options.style.entry,
    ext: comm_options.style.ext,
    require: module_list,
    external: external_list,
  }, transform);
}

function pack_page(file_name){
  var page_info = page.set(file_name);

  var external_style = page_info.external_style;
  Object.keys(external_style).forEach(function(pack_name){
    var pack_file_info = file.set(external_style[pack_name]);

    if(!pack_file_info._build){
      pack_file_info._build = true;
      efs.outputFileSync(pack_file_info.dist(), pack_external(pack_name, file_name));
    }
  });

  var page_style_info = file.set(page_info.page_style);
  efs.outputFileSync(page_style_info.dist(), pack_module(page_info.style_module(), Object.keys(external_style), file_name));
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