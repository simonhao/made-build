/**
 * Compile Page and Generate Dep Info
 * @author: SimonHao
 * @date:   2015-12-19 15:24:55
 */

'use strict';

var path   = require('path');
var fs     = require('fs');
var glob   = require('glob');
var made   = require('made-view');
var efs    = require('fs-extra');
var page   = require('../../page');
var config = require('../../config');
var file   = require('../../file');

var comm_options = config.get('comm');

function compile(file_name, model){
  var page_info = page.set(file_name);

  var options = {
    entry: comm_options.view.entry,
    ext: comm_options.view.ext,
    basedir: comm_options.path.base,
    instance: '',
    instance_through: false,
    model: model || 'dev',
    pretty: model !== 'dist',
    dep: true
  };

  var transform = {
    pack: function(val, tag, options){
      if(tag === 'link'){
        page_info.link_style(val);
      }else if(tag === 'script' && val.substring(0, 5) !== 'http'){
        page_info.link_script(val);
      }

      return val;
    },
    src: function(val, tag, options){
      var file_info = file.search(val, options);
      if(file_info){
        return file_info.url();
      }else{
        console.error('No find file: "', val, '" from file', options.filename);
        return val;
      }
    }
  };

  var render = made.compile_file(file_name, options, transform);
  var result = render();

  page_info.add_deps(result[1]);
  efs.outputFileSync(page_info.dist(), result[0]);
}

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
      compile(file_name, model);
    });
  }

  done();
};