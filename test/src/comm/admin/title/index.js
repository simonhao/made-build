/**
 * Title
 * @author: SimonHao
 * @date:   2015-12-07 15:40:33
 */

'use strict';

import Module from 'made-module';
import tips from 'comm/message/alert';

class Title extends Module{
  constructor(options, instance){
    super();

    document.querySelector(__id('wrap')).addEventListener('click', function(event){
      tips('HaHa!!!!');
    });
  }
  destructor(){
    super.destructor();
  }
}

export default Title;