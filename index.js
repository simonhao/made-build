/**
 * Made-Build入口文件
 * @author: SimonHao
 * @date:   2015-10-08 15:41:55
 */

'use strict';

var extend = require('extend');
var path   = require('path');
var config = require('made-config');
var file   = require('made-build-file');
var page   = require('made-build-page');
var fs     = require('fs');
var async  = require('async');
var utils  = require('./lib/utils');

/**
 * 启动构建
 * @param {Array}  actions 需要构建的Action，默认为源目录下所有Actions
 * @param {Object} options 配置选项
 * @param {String} options.basedir  源文件目录，默认为当前执行路径下的src
 * @param {String} options.confdir  配置文件目录，默认为当前执行路径下的conf
 * @param {String} options.distdir  生成文件的目录，默认为当前执行路径下的dist
 * @param {String} options.model    构建的模式，包括：dev,test,dist。默认为dev
 */
module.exports = function(actions, options){
  if(arguments.length === 1 && !Array.isArray(actions)){
    options = actions;
    actions = null;
  }

  if(Array.isArray(actions) && actions.length === 0){
    actions = null;
  }

  var options = extend({
    confdir: path.join(process.cwd(), 'conf'),
    model: 'dev'
  }, options);


  if(!fs.existsSync(options.confdir)){
    console.error('confdir not exists: ', options.confdir);
    return;
  }

  config.init(options.confdir);

  var comm_options = config.get('comm');
  var actions = actions || utils.actions(comm_options.path.base) || [];

  file.init({
    basedir: comm_options.path.base,
    distdir: comm_options.path.dist,
    server: comm_options.server
  });

  page.init({
    basedir: comm_options.path.base,
    distdir: comm_options.path.dist,
    server: comm_options.server
  });

  console.info('build with', options.model, 'model');

  async.eachSeries(actions, function(action_name, next){
    var build_path = path.join(comm_options.path.base, action_name);

    if(fs.existsSync(build_path) && fs.statSync(build_path).isDirectory()){
      console.info('+ start build: ', action_name);

      require('./lib/build')(build_path, options.model, function(err){
        if(err){
          console.error(err);
        }else{
          console.info('+ finish build: ', action_name);
        }

        next();
      });
    }else{
      console.error('build action is not exists: ', action_name);
      next();
    }
  });
};



























