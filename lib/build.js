/**
 * 构建队列
 * @author: SimonHao
 * @date:   2015-11-02 09:45:57
 */

'use strict';

var async = require('async');
var path  = require('path');
var fs    = require('fs');

var task = {
  'static_copy': require('./task/static/copy.js'),
  'static_version': require('./task/static/version.js'),
  'style_pack': require('./task/style/pack.js'),
  'style_min': require('./task/style/min.js'),
  'style_version': require('./task/style/version.js'),
  'template_compile': require('./task/template/compile.js'),
  'script_compile': require('./task/script/compile.js'),
  'script_pack': require('./task/script/pack.js'),
  'script_min': require('./task/script/min.js'),
  'script_version': require('./task/script/version.js'),
  'page_compile': require('./task/view/page.js'),
  'spage_compile': require('./task/view/spage.js'),
  'page_link': require('./task/link/page.js'),
  'spage_link': require('./task/link/spage.js'),
};

var dev_list = [
  'static_copy',
  'style_pack',
  'template_compile',
  'script_compile',
  'script_pack',
  'page_compile',
  'spage_compile',
  'page_link',
  'spage_link'
  ];

var dist_list = [
  'static_copy',
  'static_version',
  'style_pack',
  'style_min',
  'style_version',
  'template_compile',
  'script_compile',
  'script_pack',
  'script_min',
  'script_version',
  'page_compile',
  'spage_compile',
  'page_link',
  'spage_link'
  ];

module.exports = function(build_path, options, done){
  var build_list = (options.model === 'dist') ? dist_list : dev_list;

  async.eachSeries(build_list, function(task_name, next){
    task[task_name](build_path, next);
  }, done);
};






