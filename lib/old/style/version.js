/**
 * 增加版本号
 * @author: SimonHao
 * @date:   2015-11-02 14:26:32
 */

'use strict';

var path  = require('path');
var fs    =  require('fs');
var glob  = require('glob');
var page  = require('made-build-page');
var file  = require('made-build-file');
var async = require('async');

module.exports = function(build_path, build_model, done){
  var page_path = path.join(build_path, '/page');

  if(fs.existsSync(page_path) && fs.statSync(page_path).isDirectory()){
    glob('**/*.js', {
      cwd: page_path,
      realpath: true
    }, function(err, files){

      files.forEach(function(file_name){
        page.set(file_name).style().forEach(function(style_info){
          file.get(style_info.src).version();
        });
      });

      console.info('· success - version style');
      done();
    });
  }else{
    done();
  }
};