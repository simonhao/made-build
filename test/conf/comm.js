/**
 * 公共配置
 * @author: SimonHao
 * @date:   2015-10-30 10:51:09
 */

'use strict';

var path = require('path');

/**
 * 服务器配置
 */
exports.server = {
  web_domain: 'http://dev.qq.com',
  web_path: '/',
  static_domain: 'http://static.dev.qq.com',
  static_path: '/'
};

/**
 * 路径配置
 */
exports.path = {
  base: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist')
};