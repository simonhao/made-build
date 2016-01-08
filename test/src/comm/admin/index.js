/**
 * Admin
 * @author: SimonHao
 * @date:   2015-11-17 15:05:17
 */

'use strict';

import Module from 'made-module';

class Admin extends Module{
  constructor(options, instance){
    super();
  }
  load(page){
    console.log('load' + page);
  }
  destructor(){
    super.destructor()
  }
}

export default Admin;