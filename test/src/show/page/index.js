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

//配置页面是否为单页
exports.spage = false;