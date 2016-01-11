/**
 * 页面管理
 * @author: SimonHao
 * @date:   2015-12-19 14:24:08
 */

'use strict';

var path   = require('path');
var fs     = require('fs');
var extend = require('extend');
var mid    = require('made-id');
var file   = require('./file');
var config = require('./config');

var page_list   = {};
var comm_option = config.get('comm');

var server    = comm_option.server;
var base_path = comm_option.path.base;
var dist_path = comm_option.path.dist;
var page_path = path.join(dist_path, 'page');

var view_option = extend({
  basedir: base_path
}, comm_option.view);

var style_option = extend({
  basedir: base_path
}, comm_option.style);

var script_option = extend({
  basedir: base_path
}, comm_option.script);

exports.get = function(src){
  if(exports.has(src)){
    return page_list[src];
  }
};
exports.has = function(src){
  return src in page_list;
};
exports.set = function(src){
  if(exports.has(src)){
    return exports.get(src);
  }else{
    return page_list[src] = new PageInfo(src);
  }
};


function PageInfo(src){
  this.info = new ModuleInfo(src);
  this.deps = [];

  this.external_style = {};
  this.external_script = {};

  this.page_style = path.dirname(this.info.view) + '.css';
  this.page_script = path.dirname(this.info.view) + '.js';

  this._dist = null;
  this._url  = null;
}

PageInfo.prototype.link_style = function(pack_name){
  this.external_style[pack_name] = path.join(base_path, pack_name + '.css');
};

PageInfo.prototype.link_script = function(pack_name){
  this.external_script[pack_name] = path.join(base_path, pack_name + '.js');
};

PageInfo.prototype.script_module = function(){
  var script_module = [];

  this.deps.forEach(function(module_info){
    if(module_info.script){
      script_module.push(module_info.script);
    }
  });

  if(this.info.script){
    script_module.push(this.info.script);
  }

  return script_module;
};

PageInfo.prototype.style_module = function(){
  var style_module = [];

  this.deps.forEach(function(module_info){
    if(module_info.style){
      style_module.push(module_info.style);
    }
  });

  if(this.info.style){
    style_module.push(this.info.style);
  }

  return style_module;
};

PageInfo.prototype.add_deps = function(deps){
  var self = this;

  deps.forEach(function(dep_info){
    self.deps.push(new ModuleInfo(dep_info.filename, dep_info));
  });
};

PageInfo.prototype.entry = function(){
  var entry_list = [];

  this.deps.filter(function(module_info){
    return module_info.script;
  }).forEach(function(module_info){
    entry_list.push({
      id: module_info.id,
      options: module_info.info.options || {},
      instance: module_info.info.instance
    });
  });

  if(this.info.script){
    entry_list.push({
      id: this.info.id,
      options: {},
      instance: null
    });
  }

  return entry_list;
};

PageInfo.prototype.dist = function(){
  if(this._dist) return this._dist;

  var path_dir = path.normalize(this.info.id).split(path.sep);

  path_dir.splice(1,1);

  return this._dist = path.join(page_path, path_dir.join(path.sep) + '.html');
};

PageInfo.prototype.url = function(){
  if(this._url) return this._url

  var relative_path = path.relative(page_path, this.dist());
  var url = server.web_domain + server.web_path + relative_path.split(path.sep).join('/');

  this._url = url;

  return url;
};

/**
 * Include Module Info
 * @param {string} filename view filename
 */
function ModuleInfo(filename, info){
  this.info = info || {};
  this.view = filename;

  this.id = mid.id(filename, view_option);
  this.script = mid.path(this.id, script_option);
  this.style = mid.path(this.id, style_option);
}


















