/**
 * Min Script
 * @author: SimonHao
 * @date:   2015-12-19 15:24:12
 */

var uglifyjs = require("uglify-js");
var path     = require('path');
var fs       = require('fs');
var glob     = require('glob');
var page     = require('../../page');
var file     = require('../../file');
var config   = require('../../config');

var comm_options = config.get('comm');

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

      var page_script = file.set(page_info.page_script);
      var dist_path  = page_script.dist();
      if(!page_script.__min){
        page_script.__min = true;
        fs.writeFileSync(dist_path, uglifyjs.minify(dist_path).code);
      }

      Object.keys(page_info.external_script).forEach(function(pack_name){
        var pack_script = file.set(page_info.external_script[pack_name]);
        var dist_path = pack_script.dist();

        if(!pack_script.__min){
          pack_script.__min = true;
          fs.writeFileSync(dist_path, uglifyjs.minify(dist_path).code);
        }
      });
    });
  }

  done();
};