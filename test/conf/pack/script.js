/**
 * 脚本打包配置
 * @author: SimonHao
 * @date:   2015-10-30 10:54:20
 */

'use strict';

/**
 * 配置一个名为comm_libs的打包
 * @type {Object}
 */
exports.comm_libs = {
  require: ['jquery', 'inherits', 'made-module', 'comm/layout'],
  external: [],
  entry: ['made-view', 'made-script', 'made-instance']
};