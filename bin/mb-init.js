/**
 * Init
 * @author: SimonHao
 * @date:   2015-11-13 18:20:23
 */

'use strict';

var program = require('commander');

program
  .usage('[action_name [,..]]')
  .parse(process.argv);

console.log('init empty project', program.args);