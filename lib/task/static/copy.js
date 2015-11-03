/**
 * 复制文件
 * @author: SimonHao
 * @date:   2015-11-02 14:04:15
 */

'use strict';

var glob = require('glob');
var efs  = require('fs-extra');
var file = require('../../file.js');

module.exports = function(build_path, done){

  glob('**/*.*', {
    cwd: build_path,
    ignore: ['**/*.jade', '**/*.js', '**/*.styl', '**/*.json'],
    realpath: true
  }, function(err, files){
    files.forEach(function(file_name){
      efs.copySync(file_name, file.set(file_name).dist());
    });

    console.info('success - copy static');
    done();
  });
};