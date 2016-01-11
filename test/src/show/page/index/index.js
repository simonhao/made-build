/**
 * 首页
 * @author: SimonHao
 * @date:   2015-12-20 14:54:09
 */

'use strict';

import Module from 'made-module';

class Index extends Module{
  constructor(options, instance){
    super();

    var admin = entry('comm/admin');

    admin.load(2);

    admin.on('loaded', function(page){
      console.log('loaded', page);
    });
  }
}

export default Index;