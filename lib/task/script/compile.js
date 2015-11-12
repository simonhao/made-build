/**
 * 编译脚本
 * @author: SimonHao
 * @date:   2015-11-02 14:25:06
 */

'use strict';

var glob    = require('glob');
var config  = require('made-config');
var file    = require('made-build-file');
var efs     = require('fs-extra');
var path    = require('path');
var compile = require('made-script');

var comm_options = config.get('comm');
/**
 * 获取脚本的保存路径
 */
function get_script_dist(src){
  var relative_path = path.relative(comm_options.path.base, src);

  return path.join(file.temp('script'), relative_path);
}

var options = {
  basedir: comm_options.path.base,
  entry: 'index.js',
  ext: '.js'
};

var transform = {
  __src: function(val, sid, options){
    var file_info = file.search(val[0], {
      basedir: options.basedir,
      filename: options.filename,
      entry: '',
      ext: ''
    });

    if(file_info){
      return file_info.url();
    }else{
      return val[0];
    }
  }
};

module.exports = function(build_path, build_model, done){

  glob('**/*.js', {
    cwd: build_path,
    ignore: ['page/**/*.js'],
    realpath: true
  }, function(err, files){

    files.forEach(function(file_name){
      efs.outputFileSync(get_script_dist(file_name), compile(file_name, options, transform));
    });

    console.info('· success - compile script');
    done();
  });
};