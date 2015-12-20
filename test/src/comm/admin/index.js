/**
 * Admin
 * @author: SimonHao
 * @date:   2015-11-17 15:05:17
 */

'use strict';

var MadeModule = require('made-module');
var inherits   = require('inherits');

var AdminFrame = require('comm/admin/frame');

function Module(options, instance){
  MadeModule.call(this, __module_id, instance);

  this.admin_frame = new AdminFrame({}, __instance(''));

}

inherits(Module, MadeModule);

Module.prototype.destructor = function(){
  MadeModule.prototype.call(this);
};


module.exports = Module;