/**
 * 样式打包配置
 * @author: SimonHao
 * @date:   2015-10-30 10:55:49
 */

'use strict';

/**
 * 配置一个名为comm_styles的打包
 * @type {Object}
 */
exports.comm_styles = {
  modules: ['comm/style/base', 'comm/style/icon', 'comm/style/box'],
  external: []
};

exports.base_styles = {
  modules: ['comm/layout', 'comm/admin/frame'],
  external: ['comm_styles']
};