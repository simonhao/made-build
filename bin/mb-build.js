/**
 * Build Project
 * @author: SimonHao
 * @date:   2015-11-13 18:19:42
 */

'use strict';

var program = require('commander');
var fs      = require('fs');
var path    = require('path');
var build   = require('../index');

program
  .usage('[action_name [,..]] [optoins]')
  .option('-m, --model <build_model>', 'set build model')
  .option('-w, --watch', 'watch file when build finish')
  .parse(process.argv);

var actions = program.args;

if(actions.length === 0){
  actions = get_all_actions(path.join(process.cwd(), 'src'));
}

console.info(actions);

build(actions, {
  model: program.model
});


function get_all_actions(base_path){
  var all_actions = [];
  var has_comm = false;

  if(fs.existsSync(base_path) && fs.statSync(base_path).isDirectory()){
    all_actions = fs.readdirSync(base_path).filter(function(name){
      if(name.substring(0,1) === '.'){
        return false;
      }else if(name === 'comm'){
        has_comm = true;
        return false;
      }
      return true;
    });

    if(has_comm){
      all_actions.unshift('comm');
    }
  }

  return all_actions;
}