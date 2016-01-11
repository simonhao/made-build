/**
 * Admin
 * @author: SimonHao
 * @date:   2015-11-17 15:05:17
 */

'use strict';

import Module from 'made-module';

class Admin extends Module{
  constructor(options, instance){
    var self = this;

    super();

    self.page = 0;

    setInterval(function(){
      self.emit('loaded', self.page++);
    }, 2000);
  }
  load(page){
    console.log('load' + page);
  }
  destructor(){
    super.destructor()
  }
}

export default Admin;