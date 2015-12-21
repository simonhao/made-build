#!/usr/bin/env node

/**
 * Made-Build command
 * @author: SimonHao
 * @date:   2015-10-08 16:05:17
 */

'use strict';

var program = require('commander');
var info    = require('../package');

program
  .version(info.version)
  .command('build [action_name]', 'build project', {isDefault: true})
  .parse(process.argv);