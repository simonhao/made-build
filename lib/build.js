/**
 * 构建队列
 * @author: SimonHao
 * @date:   2015-11-02 09:45:57
 */

'use strict';

var async = require('async');

var task = {
  'static_copy': require('./task/static/copy'),
  'static_version': require('./task/static/version'),
  'style_pack': require('./task/style/pack'),
  'style_min': require('./task/style/min'),
  'style_version': require('./task/style/version'),
  'template_compile': require('./task/template/compile'),
  'script_compile': require('./task/script/compile'),
  'script_pack': require('./task/script/pack'),
  'script_min': require('./task/script/min'),
  'script_version': require('./task/script/version'),
  'page_compile': require('./task/view/page'),
  'spage_compile': require('./task/view/spage'),
  'page_link': require('./task/link/page'),
  'spage_link': require('./task/link/spage'),
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
  /*'script_version',*/
  /*'page_compile',*/
  'spage_compile',
  /*'page_link',*/
  'spage_link'
  ];

module.exports = function(build_path, build_model, done){
  var build_list = (build_model === 'dist') ? dist_list : dev_list;

  async.eachSeries(build_list, function(task_name, next){
    task[task_name](build_path, build_model, next);
  }, done);
};






