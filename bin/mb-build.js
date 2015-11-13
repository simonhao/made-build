/**
 * Build Project
 * @author: SimonHao
 * @date:   2015-11-13 18:19:42
 */

'use strict';

var program = require('commander');
var build   = require('../index');

program
  .usage('[action_name [,..]] [optoins]')
  .option('-m, --model <build_model>', 'set build model')
  .option('-w, --watch', 'watch file when build finish')
  .parse(process.argv);

build(program.args, {
  model: program.model
});