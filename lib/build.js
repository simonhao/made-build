/**
 * 构建队列
 * @author: SimonHao
 * @date:   2015-11-02 09:45:57
 */

'use strict';

var async  = require('async');

var task = {
  'static-copy': './task/static/copy',
  'static-version': './task/static/version',
  'style-pack': './task/style/pack',
  'style-min': './task/style/min',
  'style-version': './task/style/version',
  'script-pack': './task/script/pack',
  'script-min': './task/script/min',
  'script-version': './task/script/version',
  'page-compile': './task/page/compile',
  'page-link': './task/page/link',
};

var dev_task = [
  'static-copy',
  'page-compile',
  'style-pack',
  'script-pack',
  'page-link'
  ];

var test_task = [
  'static-copy',
  'page-compile',
  'style-pack',
  'script-pack',
  'page-link'
  ];

var dist_task = [
  'static-copy',
  'static-version',
  'page-compile',
  'style-pack',
  'style-min',
  'style-version',
  'script-pack',
  'script-min',
  'script-version',
  'page-link'
  ];

var build_task = {
  dev: dev_task,
  test: test_task,
  dist: dist_task
};

module.exports = function(build_path, build_model, done){
  var build_list = build_task[build_model] || build_task.dev;

  async.eachSeries(build_list, function(task_name, next){
    require(task[task_name])(build_path, build_model, function(err){
      if(err){
        console.error('· fail', task_name);
        console.error(err);
      }else{
        console.info('· success', task_name);
      }
      next();
    });
  }, done);
};





