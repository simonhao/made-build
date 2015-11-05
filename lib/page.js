/**
 * Page文件
 * @author: SimonHao
 * @date:   2015-11-02 17:27:22
 */

'use strict';

var config = require('./config.js');
var path   = require('path');
var fs     = require('fs');
var mod    = require('./module.js');

var page_path = path.join(config.options.distdir, '/page');
var page_list = {};

exports.set = function(src){
  if(src in page_list){
    return page_list[src];
  }else{
    return page_list[src] = new PageInfo(src);
  }
};


function PageInfo(src){

  this.src = src;
  this.info = require(src);
}

PageInfo.prototype.dist = function(){
  var relative_path = path.relative(config.options.basedir, this.src);
  var path_info     = path.parse(relative_path);
  var path_dir      = path_info.dir.split(path.sep);

  path_dir.splice(1,1);
  path_info.dir = path_dir.join(path.sep);
  path_info.base = path_info.name + '.html';

  return path.join(page_path, path.format(path_info));
};

PageInfo.prototype.url = function(){
  var dist_path = this.dist();
  var relative_path = path.relative(page_path, dist_path);

  return config.comm.server.web_domain + config.comm.server.web_path + relative_path.split(path.sep).join('/');
};

PageInfo.prototype.module = function(){
  if(this.info.modules){
    return mod.format(this.info.modules);
  }else{
    console.error('page', this.src, 'no config modules');
  }
};









