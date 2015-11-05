/**
 * 导航栏
 * @author: SimonHao
 * @date:   2015-11-05 14:36:10
 */

'use strict';

var MadeModule = require('made-module');
var inherits   = require('inherits');

function Module(options, instance){
  MadeModule.call(this, __module_id, instance);

  this.options  = options;

  this.wrap = document.querySelector(__id('wrap'));

  this.bind(instance);
}

inherits(Module, MadeModule);

Module.prototype.bind = function(instance){
  this.wrap.addEventListener('click', function(event){
    alert(instance);
  });
};

module.exports = Module;