/**
 * 页面管理
 * @author: SimonHao
 * @date:   2015-12-19 14:24:08
 */

'use strict';

var path   = require('path');
var fs     = require('fs');
var extend = require('extend');
var file   = require('./file');
var mid    = require('made-id');

var page_list = {};

var base_path = path.join(process.cwd(), 'src');
var dist_path = path.join(process.cwd(), 'dist');
var page_path = path.join(dist_path, 'page');

var server = {
  web_domain: '',
  web_path: '/',
  static_domain: '',
  static_path: '/'
};

exports.init = function(options){
  base_path = options.path.base;
  dist_path = options.path.dist;

  extend(server, options.server);

  page_path = path.join(dist_path, 'page');
};

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
  this.src = src;

  this._dist = null;
  this._url  = null;
  this._dep  = [];

  this.external_style = {};
  this.external_script = {};

  this._page_style = null;
  this._page_script = null;

  this.view = new ModuleInfo(src);
}

PageInfo.prototype.link_style = function(info, name){
  this.external_style[name] = info;
};

PageInfo.prototype.link_script = function(info, name){
  this.external_script[name] = info;
};

PageInfo.prototype.page_style = function(){
  if(this._page_style) return this._page_style;

  return this._page_style = file.set(path.dirname(this.src) + '.css');
};

PageInfo.prototype.page_script = function(){
  if(this._page_script) return this._page_script;

  return this._page_script = file.set(path.dirname(this.src) + '.js');
};


PageInfo.prototype.script_module = function(){
  var script_module = {};

  this._dep.forEach(function(module_info){
    var script = module_info.script();

    if(module_info.info.entry && script){
      script_module[script] = true;
    }
  });

  if(this.view.script()){
    script_module[this.view.script()] = true;
  }

  return Object.keys(script_module);
};

PageInfo.prototype.style_module = function(){
  var style_module = {};

  this._dep.forEach(function(module_info){
    var style = module_info.style();

    if(module_info.info.entry && style){
      style_module[style] = true;
    }
  });

  if(this.view.style()){
    style_module[this.view.style()] = true;
  }

  return Object.keys(style_module);
};

PageInfo.prototype.set_dep = function(dep){
  this._dep = dep.map(function(dep_info){
    return new ModuleInfo(dep_info.filename, dep_info);
  });
};

PageInfo.prototype.entry = function(){
  var entry_list = [];

  entry_list = this._dep.filter(function(module_info){
    return module_info.info.entry && module_info.script();
  }).map(function(module_info){
    return {
      id: mid.id(module_info.script(), {
        basedir: base_path,
        entry: 'index.js',
        ext: '.js'
      }),
      options: module_info.info.options,
      instance: module_info.info.instance
    };
  });

  if(this.view.script()){
    entry_list.push({
      id: mid.id(this.view.script(), {
        basedir: base_path,
        entry: 'index.js',
        ext: '.js'
      }),
      options: {},
      instance: ''
    });
  }

  return entry_list;
};

PageInfo.prototype.dist = function(){
  if(this._dist) return this._dist;

  var relative_path = path.relative(base_path, this.src);
  var path_dir      = path.dirname(relative_path).split(path.sep);

  path_dir.splice(1,1);

  return this._dist = path.join(page_path,path_dir.join(path.sep) + '.html');
};

PageInfo.prototype.url = function(){
  if(this._url) return this._url

  var relative_path = path.relative(page_path, this.dist());
  var url = server.web_domain + server.web_path + relative_path.split(path.sep).join('/');

  this._url = url;

  return url;
};



function ModuleInfo(filename, info){
  this.info = info;

  this._find_script = false;
  this._script = null;

  this._find_style = false;
  this._style = null;

  this.view = path.parse(filename);
}

ModuleInfo.prototype.script = function(){
  var filename;

  if(this._find_script) return this._script;

  this._find_script = true;

  if(this.view.base === 'view.jade'){
    filename = path.join(this.view.dir, 'index.js');
  }else{
    filename = path.join(this.view.dir, this.view.name + '.js');
  }

  if(fs.existsSync(filename) && fs.statSync(filename).isFile()){
    return this._script = filename;
  }
};

ModuleInfo.prototype.style = function(){
  var filename;

  if(this._find_style) return this._style;

  this._find_style = true;

  if(this.view.base === 'view.jade'){
    filename = path.join(this.view.dir, 'style.styl');
  }else{
    filename = path.join(this.view.dir, this.view.name + '.styl');
  }

  if(fs.existsSync(filename) && fs.statSync(filename).isFile()){
    return this._style = filename;
  }
};


















