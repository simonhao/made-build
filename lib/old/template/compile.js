/**
 * 编译模板
 * @author: SimonHao
 * @date:   2015-11-02 14:04:34
 */

'use strict';

var efs    = require('fs-extra');
var path   = require('path');
var glob   = require('glob');
var made   = require('made-view');
var config = require('made-config');
var file   = require('made-build-file');
var extend = require('extend');

var comm_options = config.get('comm');

/**
 * 获取模板的保存路径
 */
function get_tpl_dist(src){
  var relative_info = path.parse(path.relative(comm_options.path.base, src));

  relative_info.base = relative_info.name + '.tpl.js';

  return path.join(file.temp('script'), path.format(relative_info));
}

var options = {
  basedir: comm_options.path.base,
  entry: 'view.tpl',
  ext: '.tpl'
};

var transform = {
  src: function(str, sid, options){
    var file_info = file.search(str, {
      basedir: options.basedir,
      filename: options.filename,
      entry: '',
      ext: ''
    });

    if(file_info){
      return file_info.url();
    }else{
      return str;
    }
  }
};

module.exports = function(build_path, build_model, done){

  glob('**/*.tpl', {
    cwd: build_path,
    realpath: true
  }, function(err, files){

    files.forEach(function(file_name){
      var tpl_module = "var made = require('made-runtime');\nmodule.exports = ";

      tpl_module += made.compile_client_file(file_name, extend({
        model: build_model
      }, options) ,transform);

      efs.outputFileSync(get_tpl_dist(file_name), tpl_module);
    });

    console.info('· success - compile template');
    done();
  });
};