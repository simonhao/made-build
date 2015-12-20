/**
 * Reversion Script
 * @author: SimonHao
 * @date:   2015-12-19 15:23:58
 */

'use strict';

var path = require('path');
var fs   = require('fs');
var glob = require('glob');
var page = require('../../page');

module.exports = function(build_path, model, done){
  var page_path = path.join(build_path, '/page');
  var files;

  if(fs.existsSync(page_path) && fs.statSync(page_path).isDirectory()){
    files = glob.sync('**/*.jade', {
      cwd: page_path,
      realpath: true
    });

    files.forEach(function(file_name){
      var page_info = page.set(file_name);

      page_info.page_script().version();

      Object.keys(page_info.external_script).forEach(function(pack_name){
        page_info.external_script[pack_name].version();
      });
    });
  }

  done();
};