/**
 * Reversion Static
 * @author: SimonHao
 * @date:   2015-12-19 15:22:19
 */

'use strict';

var glob = require('glob');
var file = require('../../file');

module.exports = function(build_path, model, done){
  var files = glob.sync('**/*.*', {
    cwd: build_path,
    ignore: ['**/*.jade', '**/*.js', '**/*.styl', '**/*.json', '**/*.tpl'],
    realpath: true
  });

  files.forEach(function(file_name){
    file.set(file_name).version();
  });

  done();
};