/**
 * Made-Build入口文件
 * @author: SimonHao
 * @date:   2015-10-08 15:41:55
 */

'use strict';

var extend = require('extend');
var path   = require('path');
var utils  = require('./lib/utils.js');
var config = require('./lib/config.js');
var fs     = require('fs');
var async  = require('async');

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
  var options = extend({
    basedir: path.join(process.cwd(), 'src'),
    confdir: path.join(process.cwd(), 'conf'),
    distdir: path.join(process.cwd(), 'dist'),
    model: 'dev'
  }, options);

  if(!fs.existsSync(options.basedir)){
    console.errorc('basedir not exists: ', options.basedir);
    return;
  }

  if(!fs.existsSync(options.confdir)){
    console.error('confdir not exists: ', options.confdir);
    return;
  }

  var actions = actions || [];

  if(actions.length === 0){
    actions = utils.actions(options.basedir);
  }

  config.init(options);

  async.eachSeries(actions, function(action_name, next){
    var build_path = path.join(options.basedir, action_name);

    if(fs.existsSync(build_path) && fs.statSync(build_path).isDirectory()){
      console.info('start build: ', action_name);

      require('./lib/build.js')(build_path, options, function(err){
        if(err){
          console.error(err);
        }else{
          console.info('finish build: ', action_name);
        }

        next();
      });
    }else{
      console.error('build action is not exists: ', action_name);

      next();
    }
  });
};



























