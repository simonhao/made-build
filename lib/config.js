/**
 * 配置文件管理
 * @author: SimonHao
 * @date:   2015-12-19 13:43:56
 */

'use strict';

var path   = require('path');
var fs     = require('fs');
var extend = require('extend');

var conf_path = path.join(process.cwd(), 'conf');

exports.init = function(confdir){
  if(fs.existsSync(confdir) && fs.statSync(confdir).isDirectory()){
    conf_path = confdir;
  }else{
    console.error('config dir is not exists or not directory', confdir);
  }
};

var default_config = require('./default');
var config_list = {};

exports.get = function(id){
  if(id in config_list) return config_list[id];

  var conf_file = path.join(conf_path, id);
  var conf = {};

  try{
    conf = require(conf_file);
  }catch(err){
    console.error('config "', id, '" not exists, or has syntax error');
    console.error(err);
  }

  if(id === 'comm'){
    conf = extend({}, default_config, conf);
  }

  config_list[id] = conf;

  return conf;
};