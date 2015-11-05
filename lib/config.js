/**
 * 用来获取配置文件
 * @author: SimonHao
 * @date:   2015-11-02 14:09:50
 */

'use strict';

var path = require('path');
var fs   = require('fs');

exports.init = function(options){
  var comm_conf = path.join(options.confdir, 'comm.js');

  if(fs.existsSync(comm_conf)){
    try{
      exports.comm = require(comm_conf);
    }catch(err){
      console.error('comm conf has syntax error');
      console.error(err);
    }
  }else{
    console.error('comm conf file not exists');
  }

  exports.options = options;
};

exports.get = function(id){
  var conf_path = path.join(exports.options.confdir, id);
  var conf = {};

  try{
    conf = require(conf_path);
  }catch(err){
    console.error('config', id, 'not exists, or has syntax error');
    console.error(err);
  }

  return conf;
};