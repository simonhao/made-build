/**
 * 用来统一处理静态文件
 * @author: SimonHao
 * @date:   2015-11-01 10:31:38
 */

'use strict';

var config = require('./config.js');
var path   = require('path');
var crypto = require('crypto');
var fs     = require('fs');
var mid    = require('made-id');

var static_path = path.join(config.options.distdir, '/static');
var file_list   = {};

exports.get = function(id, options){
  var src = mid.path(id, options);

  if(src in file_list){
    return file_list[src];
  }else{
    console.error('no file', src);
  }
};

exports.has = function(src){
  return src in file_list;
};

/**
 * 通过源文件来增加一个静态文件
 * @param {String} src 源文件目录
 */
exports.set = function(src){
  if(src in file_list){
    return file_list[src];
  }else{
    return file_list[src] = new FileInfo(src);
  }
};


/**
 * 生成文件的MD5
 * @param  {String} file_path 文件路径
 * @return {String}           文件的MD5值
 */
function gen_file_md5(file_path){
    var file_str = fs.readFileSync(file_path, 'utf-8');

    return crypto.createHash('md5').update(file_str).digest('hex').substring(0,8);
}

function FileInfo(src){
  this.src = src;
  this.md5 = null;
}

/**
 * 获取静态文件的生成路径
 * @return {String} 路径名
 */
FileInfo.prototype.dist = function(){
  var relative_path = path.relative(config.options.basedir, this.src);

  var dist_path = path.join(static_path, relative_path);
  var dist_info;

  if(this.md5){
    dist_info = path.parse(dist_path);
    dist_info.base = dist_info.name + '.' + this.md5 + dist_info.ext;

    return path.format(dist_info);
  }else{
    return dist_path;
  }
};

/**
 * 获取静态文件的URL路径
 * @return {String} URL
 */
FileInfo.prototype.url = function(){
  var dist_path = this.dist();
  var relative_path = path.relative(static_path, dist_path);

  return config.comm.server.static_domain + config.comm.server.static_path + relative_path.split(path.sep).join('/');
};

/**
 * 给静态文件增加版本号
 */
FileInfo.prototype.version = function(){
  if(this.md5) return true;

  var dist_path = this.dist();
  var file_md5  = gen_file_md5(dist_path);
  var path_info = path.parse(dist_path);

  this.md5 = file_md5;
  path_info.base = path_info.name + '.' + file_md5 + path_info.ext;

  return fs.renameSync(dist_path, path.format(path_info));
};















