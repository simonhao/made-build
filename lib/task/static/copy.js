/**
 * 复制文件
 * @author: SimonHao
 * @date:   2015-11-02 14:04:15
 */

'use strict';

var efs  = require('fs-extra');
var glob = require('glob');
var file = require('made-build-file');

module.exports = function(build_path, build_model, done){

  glob('**/*.*', {
    cwd: build_path,
    ignore: ['**/*.jade', '**/*.js', '**/*.styl', '**/*.json', '**/*.tpl'],
    realpath: true
  }, function(err, files){
    files.forEach(function(file_name){
      efs.copySync(file_name, file.set(file_name).dist());
    });

    console.info('· success - copy static');
    done();
  });
};