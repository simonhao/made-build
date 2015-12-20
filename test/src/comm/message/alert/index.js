/**
 * 弹出框
 * @author: SimonHao
 * @date:   2015-11-04 09:36:54
 */

'use strict';

var alert_template = require('./view.tpl');

var $ = require('jquery');

module.exports = function(msg){

  $('body').append(alert_template({
    msg: msg
  }));

};