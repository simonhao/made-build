/**
 * 编译页面
 * @author: SimonHao
 * @date:   2015-11-02 14:06:22
 */

'use strict';

var path = require('path');
var fs   =  require('fs');
var glob = require('glob');
var page = require('../../page.js');
var view = require('./index.js');
var efs  = require('fs-extra');

module.exports = function(build_path, done){
  var page_path = path.join(build_path, '/page');

  if(fs.existsSync(page_path) && fs.statSync(page_path).isDirectory()){
    glob('**/*.js', {
      cwd: page_path,
      realpath: true
    }, function(err, files){
      files.forEach(function(file_name){
        var page_info = page.set(file_name);
        var view_info = view.info(page_info);

        efs.outputFileSync(page_info.dist(), view.render(view_info));
      });

      console.info('success - compile page');
      done();
    });
  }else{
    console.info('success - compile page');
    done();
  }
};