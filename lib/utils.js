/**
 * Utils
 * @author: SimonHao
 * @date:   2015-10-30 10:21:04
 */

'use strict';

var fs   = require('fs');
var path = require('path');

/**
 * 获取某一目录下面的全部Actions
 * @param  {String} basedir 目录名
 * @return {Array}          Actions列表
 */
exports.actions = function(basedir){
  var has_comm = false;

  var all_actions = fs.readdirSync(basedir).filter(function(name){
    if(name === 'comm'){
      has_comm = true;
      return false;
    }

    if(name.charAt(0) === '.'){
      return false;
    }

    return fs.statSync(path.join(basedir, name)).isDirectory();
  });

  if(has_comm) all_actions.unshift('comm');

  return all_actions;
};