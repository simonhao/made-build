/**
 * Admin
 * @author: SimonHao
 * @date:   2015-11-17 15:05:17
 */

'use strict';

var MadeModule = require('made-module');
var inherits   = require('inherits');

var AdminFrame = require('comm/admin/frame');
var AdminNavbar = require('comm/admin/navbar');

function Module(options, instance){
  MadeModule.call(this, __module_id, instance);

  this.admin_frame = new AdminFrame({}, __instance(''));

  this.top_navbar = new AdminNavbar({}, __instance('top'));
  this.bottom_navbar = new AdminNavbar({}, __instance('bottom'));
}

inherits(Module, MadeModule);

Module.prototype.destructor = function(){
  MadeModule.prototype.call(this);
};


module.exports = Module;