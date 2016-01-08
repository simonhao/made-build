/**
 * Min Style
 * @author: SimonHao
 * @date:   2015-12-19 15:22:44
 */

'use strict';

var CleanCSS = require('clean-css');
var path     = require('path');
var fs       = require('fs');
var glob     = require('glob');
var page     = require('../../page');
var file     = require('../../file');
var config   = require('../../config');

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

      var page_style = file.set(page_info.page_style);
      var dist_path  = page_style.dist();
      if(!page_style.__min){
        page_style.__min = true;
        fs.writeFileSync(dist_path, new CleanCSS().minify(fs.readFileSync(dist_path)).styles);
      }

      Object.keys(page_info.external_style).forEach(function(pack_name){
        var pack_style = file.set(page_info.external_style[pack_name]);
        var dist_path = pack_style.dist();

        if(!pack_style.__min){
          pack_style.__min = true;
          fs.writeFileSync(dist_path, new CleanCSS().minify(fs.readFileSync(dist_path)).styles);
        }
      });
    });
  }

  done();
};