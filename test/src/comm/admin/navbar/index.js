/**
 * 导航栏
 * @author: SimonHao
 * @date:   2015-11-05 14:36:10
 */

'use strict';

import Module from 'made-module';

class Navbar extends Module{
  constructor(options, instance){
    super();
    this.wrap = document.querySelector(__id('wrap'));
    this.bind(instance);
  }
  bind(instance){
    this.wrap.addEventListener('click', function(event){
      alert(instance);
    });
  }
}

export default Navbar;