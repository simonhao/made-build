/**
 * Made-Build入口文件
 * @author: SimonHao
 * @date:   2015-10-08 15:41:55
 */

'use strict';

var extend = require('extend');
var path   = require('path');
var fs     = require('fs');
var async  = require('async');
var file   = require('./lib/file');
var page   = require('./lib/page');
var config = require('./lib/config');
var build  = require('./lib/build');

/**
 * 启动构建
 * @param {Array}  actions 需要构建的Action，默认为源目录下所有Actions
 * @param {Object} options 配置选项
 * @param {String} options.confdir  配置文件目录，默认为当前执行路径下的conf
 * @param {String} options.model    构建的模式，包括：dev,test,dist。默认为dev
 */
module.exports = function(actions, options){
  var actions = actions || [];
  var options = extend({
    confdir: path.join(process.cwd(), 'conf'),
    model: 'dev'
  }, options);

  if(fs.existsSync(options.confdir) && fs.statSync(options.confdir).isDirectory()){
    config.init(options.confdir);
  }else{
    console.error('confdir not exists or not directory: ', options.confdir);
    return;
  }

  var comm_options = config.get('comm');

  file.init(comm_options);
  page.init(comm_options);

  async.eachSeries(actions, function(action_name, next){
    var build_path = path.join(comm_options.path.base, action_name);

    if(fs.existsSync(build_path) && fs.statSync(build_path).isDirectory()){
      console.info('+ start build', action_name);
      build(build_path, options.model, next);
    }else{
      console.error('build action', action_name, 'is not exists or not directory');
    }
  });
};



























