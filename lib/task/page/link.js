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
var file    = require('../../file');
var config  = require('../../config');
var page    = require('../../page');

var comm_options = config.get('comm');

function build_script_ele(url){
  return '<script src="' + url + '" pack="page"></script>';
}

function build_style_ele(url){
  return '<link rel="stylesheet" href="' + url + '" pack="page">';
}

function get_entry_code(entry_list){
  var code = ['(function(){'];

  entry_list.forEach(function(script_module){
    code.push('entry.create(require("');
    code.push(script_module.id);
    code.push('")._default,"');
    code.push(script_module.id);
    code.push('","');

    if(script_module.instance){
      code.push(script_module.instance);
    }

    code.push('",');
    code.push(JSON.stringify(script_module.options || {}));
    code.push(');');
  });

  code.push('})();');

  return code.join('');
};

function build_script_entry(entry_list){
    return '<script pack="page">' + get_entry_code(entry_list) + '</script>';
}

function link(file_name){
  var page_info = page.set(file_name);
  var page_str  = fs.readFileSync(page_info.dist(), 'utf-8');

  var $ = cheerio.load(page_str, {decodeEntities: false});

  var external_script = page_info.external_script;
  Object.keys(external_script).forEach(function(pack_name){
    $('script[pack="' + pack_name + '"]').attr('src', file.set(external_script[pack_name]).url());
  });
  $('body').append(build_script_ele(file.set(page_info.page_script).url()));
  $('body').append(build_script_entry(page_info.entry()));

  var external_style = page_info.external_style;
  Object.keys(external_style).forEach(function(pack_name){
    $('link[pack="' + pack_name + '"]').attr('href', file.set(external_style[pack_name]).url());
  });
  $('head').append(build_style_ele(file.set(page_info.page_style).url()));

  efs.outputFileSync(page_info.dist(), $.html());
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
      link(file_name);
    });
  }

  done();
};