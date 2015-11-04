/**
 * 编译模板
 * @author: SimonHao
 * @date:   2015-11-02 14:04:34
 */

'use strict';

var glob   = require('glob');
var made   = require('made-view');
var config = require('../../config');
var file   = require('../../file');
var efs    = require('fs-extra');
var path   = require('path');

var tpl_path = path.join(config.options.distdir, '/temp/script');

/**
 * 获取模板的保存路径
 */
function get_tpl_dist(src){
  var relative_path = path.relative(config.options.basedir, src);
  var relative_info = path.parse(relative_path);

  relative_info.base = relative_info.name + '.tpl.js';

  return path.join(tpl_path, path.format(relative_info));
}

module.exports = function(build_path, done){

  glob('**/*.tpl', {
    cwd: build_path,
    realpath: true
  }, function(err, files){

    files.forEach(function(file_name){
      var tpl_module = "var made = require('made-runtime');\nmodule.exports = ";

      tpl_module += made.compile_client_file(file_name, {
        basedir: config.options.basedir,
        entry: 'view.tpl',
        ext: '.tpl'
      },{
        src: function(str, sid, options){
          var file_info = file.get(str, options);
          if(file_info){
            return file_info.url();
          }else{
            return str;
          }
        }
      });

      efs.outputFileSync(get_tpl_dist(file_name), tpl_module);
    });

    console.info('success - compile template');
    done();
  });
};