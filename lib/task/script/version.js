/**
 * Reversion Script
 * @author: SimonHao
 * @date:   2015-12-19 15:23:58
 */

'use strict';

var path   = require('path');
var fs     = require('fs');
var glob   = require('glob');
var page   = require('../../page');
var file   = require('../../file');
var config = require('../../config');

var comm_options = config.get('comm');

module.exports = function(build_path, model, done){
  var page_path = path.join(build_path, '/page');
  var page_regx = '**/*' + comm_options.view.ext;
  var files;

  if(fs.existsSync(page_path) && fs.statSync(page_path).isDirectory()){
    files = glob.sync(page_regx, {
      cwd: page_path,
      realpath: true
    });

    files.forEach(function(file_name){
      var page_info = page.set(file_name);

      file.set(page_info.page_script).version();

      Object.keys(page_info.external_script).forEach(function(pack_name){
        file.set(page_info.external_script[pack_name]).version();
      });
    });
  }

  done();
};