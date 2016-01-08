/**
 * 弹出框
 * @author: SimonHao
 * @date:   2015-11-04 09:36:54
 */

'use strict';

import alert_template from 'view.tpl';

import * as $ from 'jquery';

export default function(msg){

  $('body').append(alert_template({
    msg: msg
  }));

};