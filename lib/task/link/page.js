/**
 * 链接页面
 * @author: SimonHao
 * @date:   2015-11-02 14:05:26
 */

'use strict';

var path    = require('path');
var fs      =  require('fs');
var glob    = require('glob');
var page    = require('made-build-page');
var file    = require('made-build-file');
var async   = require('async');
var cheerio = require('cheerio');
var efs     = require('fs-extra');

function build_script_ele(url){
    return '<script src="' + url + '"></script>';
}

function build_style_ele(url){
    return '<link rel="stylesheet" href="' + url.style(file_name) + '">';
}

function get_entry_code(entry_info){
  var code = ['(function(){ function init(module, options, instance){if(module.prototype && module.prototype._made_module){new module(options, instance)}};'];

  entry_info.forEach(function(script_module){
    code.push('init(require(\'' + script_module.id + '\'),' + JSON.stringify(script_module.options) + ',\'' + script_module.instance + '\');');
  });

  code.push('})()');

  return code.join('\n');
};

function build_script_entry(entry_info){
    return '<script>' + get_entry_code(entry_info) + '</script>';
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
        var dist_path = page_info.dist();
        var page_str  = fs.readFileSync(dist_path, 'utf-8');

        var $ = cheerio.load(page_str, {decodeEntities: false});

        page_info.script().forEach(function(script_info){
          var file_info = file.get(script_info.src);

          $('body').append(build_script_ele(file_info.url()));
        });

        $('body').append(build_script_entry(page_info.entry()));

        efs.outputFileSync(dist_path, $.html());
      });

      console.info('· success - link page');
      done();
    });
  }else{
    done();
  }
};