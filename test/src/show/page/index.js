/**
 * 首页
 * @author: SimonHao
 * @date:   2015-10-30 11:10:19
 */

'use strict';

//配置页面模块
exports.modules = {
  id: 'comm/layout',
  config: {
    title: 'Index',
    desc: 'Index Desc',
    keywords: ['made','build','front-end']
  },
  modules: [{
    id: 'comm/admin/frame',
    block: 'main',
    modules: [{
      id: 'show/bridge/menu',
      block: 'menu',
      modules:[{
        id: 'comm/admin/menu',
        block: 'menu'
      },{
        id: 'comm/admin/title',
        block: 'title',
        config: {
          keywords: ['name', 'age', 'sex'],
          name: {
            first: 'simon'
          }
        }
      }]
    },{
      id: 'comm/admin/toolbar',
      block: 'toolbar'
    },{
      id: 'comm/admin/navbar',
      block: 'top_navbar',
      instance: 'top'
    },{
      id: 'comm/admin/navbar',
      block: 'bottom_navbar',
      instance: 'bottom'
    },{
      id: 'comm/admin/navlist',
      block: 'navlist'
    }]
  }]
};

//配置页面外部依赖
exports.external = {
  script: ['comm_libs'],
  style: ['comm_styles']
};

//配置页面内模块打包
exports.pack = {
  script: [
    ['comm/admin/menu', 'comm/admin/title'],
    ['comm/admin/toolbar', 'comm/admin/navbar']
  ],
  style: [
    ['comm/admin/menu', 'comm/admin/title'],
    ['comm/admin/toolbar', 'comm/admin/navbar']
  ]
};

//配置页面单独引入的脚本
exports.script = {
  head: [
    'comm/tool/render'
  ],
  before: [
    'http://open.mobile.qq.com/sdk/qqapi.js?_bid=152',
    'comm/tool/speed'
  ],
  after: [
    'http://pingjs.qq.com/ping.js',
    'comm/tool/report'
  ]
};

//配置页面是否为单页
exports.spage = false;