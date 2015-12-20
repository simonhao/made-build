/**
 * Title
 * @author: SimonHao
 * @date:   2015-12-07 15:40:33
 */

'use strict';

var MadeModule = require('made-module');
var inherits   = require('inherits');
var tips = require('comm/message/alert');

function Module(options, instance){
  MadeModule.call(this, __module_id, instance);

  document.querySelector(__id('wrap')).addEventListener('click', function(event){
    tips('HaHa!!!!');
  });
}

inherits(Module, MadeModule);

Module.prototype.destructor = function(){
  MadeModule.prototype.call(this);
};

module.exports = Module;