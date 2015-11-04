/**
 * layout entry
 * @author: SimonHao
 * @date:   2015-10-30 11:17:04
 */

'use strict';

var MadeModule = require('made-module');
var inherits   = require('inherits');

function Module(options, instance){
  MadeModule.call(this, __module_id, instance);

  this.bind();
}

inherits(Module, MadeModule);

Module.prototype.bind = function(){
  var classname = __class('header');
  var id = __id('header');
  var src = __src('comm/admin/frame/readme.md');
  var instance = __instance('top');

  var name = find(__id('header'));
};

Module.prototype.destructor = function(){
  MadeModule.prototype.call(this);
};


module.exports = Module;