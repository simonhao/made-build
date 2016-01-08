/**
 *
 * @author: SimonHao
 * @date:   2015-11-04 14:16:40
 */

'use strict';

import Module from 'made-module';


class AdminFrame extends Module{
  constructor(options, instance){
    super();

    this.bind(instance);
  }
  bind(instance){
    var classname = __class('wrap');
    var id = __id('wrap');
    var src = __src('readme.md');
    var instance = __instance('top');

    console.log(classname, id, src, instance);
  }
  destructor(){
    super.destructor();
  }
}

export default AdminFrame;