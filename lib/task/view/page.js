/**
 * 编译页面
 * @author: SimonHao
 * @date:   2015-11-02 14:06:22
 */

'use strict';

var path   = require('path');
var fs     =  require('fs');
var glob   = require('glob');
var made   =  require('made-view');
var page   = require('made-build-page');
var config = require('made-config');
var file   = require('made-build-file');
var efs    = require('fs-extra');
var extend = require('extend');

var comm_options = config.get('comm');

var options = {
  basedir: comm_options.path.base,
  entry: 'view.jade',
  ext: '.jade'
};

var transform = {
  src: function(str, sid, options){
    var file_info = file.search(str, options);

    if(file_info){
      return file_info.url();
    }else{
      return str;
    }
  }
}

function render_page(document_ast, filename){
  var render_options = extend({
    filename: filename
  }, options);

  var render_func = made.compile_ast(document_ast, render_options, transform);

  return render_func();
}

module.exports = function(build_path, build_model, done){
  var page_path = path.join(build_path, '/page');

  if(fs.existsSync(page_path) && fs.statSync(page_path).isDirectory()){
    glob('**/*.js', {
      cwd: page_path,
      realpath: true
    }, function(err, files){

      files.forEach(function(file_name){
        var page_info = page.set(file_name);

        efs.outputFileSync(page_info.dist(), render_page(page_info.view(), file_name));
      });

      console.info('· success - compile page');
      done();
    });
  }else{
    console.info('· success - compile page');
    done();
  }
};