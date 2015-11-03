/**
 * 增加版本号
 * @author: SimonHao
 * @date:   2015-11-02 14:21:12
 */

'use strict';

var glob = require('glob');
var file = require('../../file.js');

module.exports = function(build_path, done){

  glob('**/*.*', {
    cwd: build_path,
    ignore: ['**/*.jade', '**/*.js', '**/*.styl', '**/*.json'],
    realpath: true
  }, function(err, files){
    files.forEach(function(file_name){
      file.set(file_name).version();
    });

    console.info('success - version static');
    done();
  });
};