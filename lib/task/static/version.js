/**
 * Reversion Static
 * @author: SimonHao
 * @date:   2015-12-19 15:22:19
 */

'use strict';

var glob = require('glob');
var file = require('../../file');
var config = require('../../config');

var comm_options = config.get('comm');

module.exports = function(build_path, model, done){
  var files = glob.sync('**/*.*', {
    cwd: build_path,
    ignore: [
      '**/*' + comm_options.view.ext,
      '**/*' + comm_options.script.ext,
      '**/*' + comm_options.style.ext,
      '**/*' + comm_options.template.ext],
    realpath: true
  });

  files.forEach(function(file_name){
    file.set(file_name).version();
  });

  done();
};