/**
 * default config
 * @author: SimonHao
 * @date:   2016-01-08 10:57:29
 */

'use strict';

var path = require('path');

/**
 * default server
 */
exports.server = {
  web_domain: '',
  web_path: '/',
  static_domain: '',
  static_path: '/'
};

/**
 * default path
 */
exports.path = {
  base: path.join(process.cwd(), 'src'),
  dist: path.join(process.cwd(), 'dist')
};

exports.view = {
  entry: 'view.jade',
  ext: '.jade'
};

exports.style = {
  entry: 'style.css',
  ext: '.css'
};

exports.script = {
  entry: 'index.js',
  ext: '.js'
};

exports.template = {
  entry: 'view.tpl',
  ext: '.tpl'
};