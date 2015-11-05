/**
 * 增加版本号
 * @author: SimonHao
 * @date:   2015-11-02 14:25:55
 */

'use strict';

var path   = require('path');
var fs     =  require('fs');
var glob   = require('glob');
var page   = require('../../page.js');
var async  = require('async');

module.exports = function(build_path, done){
  var page_path = path.join(build_path, '/page');

  if(fs.existsSync(page_path) && fs.statSync(page_path).isDirectory()){
    glob('**/*.js', {
      cwd: page_path,
      realpath: true
    }, function(err, files){

      async.eachSeries(files, function(file_name, next){
        var page_info = page.set(file_name);

        page_info.script.forEach(function(file_info){
          if(!file_info.md5){
            file_info.version();
          }
        });

        next();
      }, function(err){
        console.info('success - version script');
        done();
      });
    });
  }else{
    console.info('success - version script');
    done();
  }
};