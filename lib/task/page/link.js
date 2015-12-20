/**
 * Link Page Style and Script
 * @author: SimonHao
 * @date:   2015-12-19 15:25:04
 */

'use strict';

var path    = require('path');
var fs      = require('fs');
var glob    = require('glob');
var efs     = require('fs-extra');
var cheerio = require('cheerio');
var fs      = require('fs');
var page    = require('../../page');

function build_script_ele(url){
  return '<script src="' + url + '"></script>';
}

function build_style_ele(url){
    return '<link rel="stylesheet" href="' + url + '">';
}

function get_entry_code(entry_list){
  var code = ['(function(){ function init(module, options, instance){if(module.prototype && module.prototype._made_module){new module(options, instance)}};'];

  entry_list.forEach(function(script_module){
    code.push('init(require(\'' + script_module.id + '\'),' + JSON.stringify(script_module.options) + ',\'' + script_module.instance + '\');');
  });

  code.push('})();');

  return code.join('\n');
};

function build_script_entry(entry_list){
    return '<script>' + get_entry_code(entry_list) + '</script>';
}

function link(file_name){
  var page_info = page.set(file_name);
  var dist_path = page_info.dist();
  var page_str  = fs.readFileSync(dist_path, 'utf-8');

  var $ = cheerio.load(page_str, {decodeEntities: false});

  var external_script = page_info.external_script;

  Object.keys(external_script).forEach(function(pack_name){
    $('script[src="' + pack_name + '"]').attr('src', external_script[pack_name].url());
  });
  $('body').append(build_script_ele(page_info.page_script().url()));
  $('body').append(build_script_entry(page_info.entry()));

  var external_style = page_info.external_style;
  Object.keys(external_style).forEach(function(pack_name){
    $('link[href="' + pack_name + '"]').attr('href', external_style[pack_name].url());
  });
  $('head').append(build_style_ele(page_info.page_style().url()));

  efs.outputFileSync(dist_path, $.html());
}

module.exports = function(build_path, model, done){
  var page_path = path.join(build_path, '/page');
  var files;

  if(fs.existsSync(page_path) && fs.statSync(page_path).isDirectory()){
    files = glob.sync('**/*.jade', {
      cwd: page_path,
      realpath: true
    });

    files.forEach(function(file_name){
      link(file_name);
    });
  }

  done();
};