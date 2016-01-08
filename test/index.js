/**
 * 测试
 * @author: SimonHao
 * @date:   2015-10-30 10:37:41
 */

'use strict';

var build = require('../index.js');
var path  = require('path');

build(['comm', 'show'], {
  confdir: path.join(__dirname, 'conf'),
  model: 'dev',
});