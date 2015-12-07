/**
 * 详情页
 * @author: SimonHao
 * @date:   2015-10-30 11:10:33
 */

'use strict';

//配置页面模块
exports.modules = {
  id: 'comm/layout',
  config: {
    keywords: [1,2,3]
  },
  modules:[{
    id: 'comm/admin',
    block: 'main'
  }]
};

exports.external = {
  script: ['comm_libs'],
  style: ['comm_styles']
};

//配置页面单独引入的脚本
exports.script = {

};

//配置页面是否为单页
exports.spage = false;