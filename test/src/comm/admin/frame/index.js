/**
 *
 * @author: SimonHao
 * @date:   2015-11-04 14:16:40
 */

'use strict';

var MadeModule = require('made-module');
var inherits   = require('inherits');

function Module(options, instance){
  MadeModule.call(this, __module_id, instance);

  this.bind(instance);
}

inherits(Module, MadeModule);

Module.prototype.bind = function(instance){
  var classname = __class('wrap');
  var id = __id('wrap');
  var src = __src('readme.md');
  var instance = __instance('top');

  console.log(classname, id, src, instance);
};

Module.prototype.destructor = function(){
  MadeModule.prototype.call(this);
};


module.exports = Module;