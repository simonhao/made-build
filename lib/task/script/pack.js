/**
 * 打包脚本
 * @author: SimonHao
 * @date:   2015-11-02 14:25:31
 */

'use strict';

var path   = require('path');
var fs     =  require('fs');
var glob   = require('glob');
var page   = require('../../page.js');
var script = require('./index.js');
var efs    = require('fs-extra');
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

        script.pack(page_info, next);
      }, function(err){
        console.info('success - compile page');
        done();
      });
    });
  }else{
    console.info('success - pack script');
    done();
  }
};