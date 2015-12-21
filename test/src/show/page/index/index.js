/**
 * 首页
 * @author: SimonHao
 * @date:   2015-12-20 14:54:09
 */

'use strict';

var MadeModule = require('made-module');
var inherits   = require('inherits');
var report     = require('report');

function Module(options, instance){
  MadeModule.call(this, __module_id, instance);

  this.title = document.querySelector(__class('title'));

  this.bind();
}

inherits(Module, MadeModule);

Module.prototype.bind = function(){
  this.title.addEventListener('click', function(){
    alert('qqqq');
  });
};

Module.prototype.destructor = function(){
  MadeModule.prototype.call(this);
};


module.exports = Module;