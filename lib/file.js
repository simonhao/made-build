/**
 * 文件管理
 * @author: SimonHao
 * @date:   2015-11-12 10:31:48
 */

'use strict';

var path   = require('path');
var crypto = require('crypto');
var fs     = require('fs');
var mid    = require('made-id');
var extend = require('extend');
var config = require('./config');

var file_list   = {};
var comm_option = config.get('comm');

var server      = comm_option.server;
var base_path   = comm_option.path.base;
var dist_path   = comm_option.path.dist;
var static_path = path.join(dist_path, 'static');

/**
 * 通过ID与选项来寻找一个源文件
 * @param  {String} id      模块ID
 * @param  {Object} options 选项
 * @return {Object}         文件信息实例
 */
exports.search = function(id, options){
  var src = mid.path(id, options);

  return exports.get(src);
};

/**
 * 获取文件
 * @param  {String} src 文件源地址
 * @return {Object}     文件信息
 */
exports.get = function(src){
  if(exports.has(src)){
    return file_list[src];
  }
};

/**
 * 判断是否存在该文件
 * @param  {String}  src 源文件路径
 * @return {Boolean}     是否存在
 */
exports.has = function(src){
  return src in file_list;
};

/**
 * 通过源文件来增加一个静态文件
 * @param {String} src 源文件目录
 */
exports.set = function(src){
  if(exports.has(src)){
    return exports.get(src);
  }else{
    return file_list[src] = new FileInfo(src);
  }
};


/**
 * 生成文件的MD5
 * @param  {String} filename  文件路径
 * @return {String}           文件的MD5值
 */
function gen_file_md5(filename){
    var file_str = fs.readFileSync(filename, 'utf-8');

    return crypto.createHash('md5').update(file_str).digest('hex').substring(0,8);
}

function FileInfo(src){
  this.src = src;

  this._md5  = null;
  this._dist = null;
  this._url  = null;
}

/**
 * 获取静态文件的生成路径
 * @return {String} 路径名
 */
FileInfo.prototype.dist = function(){
  if(this._dist) return this._dist;

  var relative_path = path.relative(base_path, this.src);

  var dist_path, dist_info;

  if(relative_path[0] === '.'){
    dist_path = path.join(static_path, mid.id(this.src, {
      basedir: base_path,
      entry: '',
      ext: ''
    }));
  }else{
    dist_path = path.join(static_path, relative_path);
  }


  if(this._md5){
    dist_info = path.parse(dist_path);
    dist_info.base = dist_info.name + '.' + this._md5 + dist_info.ext;

    dist_path = path.format(dist_info);
  }

  this._dist = dist_path;

  return dist_path;
};

/**
 * 获取静态文件的URL路径
 * @return {String} URL
 */
FileInfo.prototype.url = function(){
  if(this._url) return this._url;

  var relative_path = path.relative(static_path, this.dist());
  var url = server.static_domain + server.static_path + relative_path.split(path.sep).join('/');

  this._url = url;

  return url;
};

/**
 * 给静态文件增加版本号
 */
FileInfo.prototype.version = function(){
  if(this._md5) return;

  var dist_path = this.dist();

  this._md5  = gen_file_md5(dist_path);
  this._dist = null;
  this._url  = null;

  return fs.renameSync(dist_path, this.dist());
};








