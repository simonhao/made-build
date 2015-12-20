/**
 * 压缩样式
 * @author: SimonHao
 * @date:   2015-11-02 14:26:06
 */

'use strict';

var CleanCSS = require('clean-css');
var path     = require('path');
var fs       =  require('fs');
var glob     = require('glob');
var page     = require('made-build-page');
var file     = require('made-build-file');
var async    = require('async');

module.exports = function(build_path, build_model, done){
  var page_path = path.join(build_path, '/page');

  if(fs.existsSync(page_path) && fs.statSync(page_path).isDirectory()){
    glob('**/*.js', {
      cwd: page_path,
      realpath: true
    }, function(err, files){

      files.forEach(function(file_name){
        page.set(file_name).style().forEach(function(style_info){
          var file_info = file.get(style_info.src);
          var file_path = file_info.dist();
          var file_str = '';

          if(!file_info.__min){
            file_info.__min = true;
            file_str = fs.readFileSync(file_path, 'utf-8');
            fs.writeFileSync(file_path, new CleanCSS().minify(file_str).styles);
          }
        });
      });

      console.info('· success - min style');
      done();
    });
  }else{
    done();
  }
};