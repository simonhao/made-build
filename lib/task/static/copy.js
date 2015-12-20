/**
 * Copy Static
 * @author: SimonHao
 * @date:   2015-12-19 15:19:25
 */

'use strict';

var efs  = require('fs-extra');
var glob = require('glob');
var file = require('../../file.js');

module.exports = function(build_path, model, done){
  var files = glob.sync('**/*.*', {
    cwd: build_path,
    ignore: ['**/*.jade', '**/*.js', '**/*.styl', '**/*.json', '**/*.tpl'],
    realpath: true
  });

  files.forEach(function(file_name){
    efs.copySync(file_name, file.set(file_name).dist());
  });

  done();
};