/**
 * layout entry
 * @author: SimonHao
 * @date:   2015-10-30 11:17:04
 */

'use strict';

import Module from 'made-module';

class Layout extends Module{
  constructor(options, instance){
    super();

    this.bind();
  }
  bind(){
    var classname = __class('header');
    var id = __id('header');
    var src = __src('comm/admin/frame/readme.md');
    var instance = __instance('top');
  }
  destructor(){
    super.destructor();
  }
}

export default Layout;