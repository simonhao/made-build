/**
 * Create
 * @author: SimonHao
 * @date:   2015-11-13 18:20:11
 */

'use strict';

var program = require('commander');

program
  .usage('[action_name [,..]] [optoins]')
  .parse(process.argv);

console.log('create', program.args);