/**
 * 链接页面
 * @author: SimonHao
 * @date:   2015-11-02 14:05:26
 */

'use strict';

var path  = require('path');
var fs    =  require('fs');
var glob  = require('glob');
var page  = require('../../page.js');
var async = require('async');
var cheerio = require('cheerio');
var efs = require('fs-extra');
var script = require('../script/index.js');

function build_script_ele(url){
    return '<script src="' + url + '"></script>';
}

function build_style_ele(url){
    return '<link rel="stylesheet" href="' + url.style(file_name) + '">';
}

function build_script_entry(entry_code){
    return '<script>' + entry_code + '</script>';
}

module.exports = function(build_path, done){
  var page_path = path.join(build_path, '/page');

  if(fs.existsSync(page_path) && fs.statSync(page_path).isDirectory()){
    glob('**/*.js', {
      cwd: page_path,
      realpath: true
    }, function(err, files){

      async.eachSeries(files, function(file_name, next){
        var page_info = page.set(file_name);
        var dist_path = page_info.dist();
        var page_str = fs.readFileSync(dist_path, 'utf-8');
        var $ = cheerio.load(page_str, {decodeEntities: false});

        page_info.script.forEach(function(file_info){
          $('body').append(build_script_ele(file_info.url()));
        });

        $('body').append(build_script_entry(script.entry(page_info)));

        efs.outputFileSync(dist_path, $.html());
        next();
      }, function(err){
        console.info('success - link page');
        done();
      });
    });
  }else{
    console.info('success - link page');
    done();
  }
};