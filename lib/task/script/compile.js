/**
 * 编译脚本
 * @author: SimonHao
 * @date:   2015-11-02 14:25:06
 */

'use strict';
var glob       = require('glob');
var config     = require('../../config');
var file       = require('../../file');
var efs        = require('fs-extra');
var path       = require('path');
var fs         = require('fs');
var esprima    = require('esprima');
var estraverse = require('estraverse');
var escodegen  = require('escodegen');
var mid        = require('made-id');

var script_path = path.join(config.options.distdir, '/temp/script');

/**
 * 获取脚本的保存路径
 */
function get_script_dist(src){
  var relative_path = path.relative(config.options.basedir, src);

  return path.join(script_path, relative_path);
}

/**
 * 编译脚本
 */
function compile_script(src){
  var options = {
    basedir: config.options.basedir,
    entry: 'index.js',
    ext: '.js'
  };

  var id  = mid.id(src, options);
  var sid = mid.sid(src, options);

  var str = fs.readFileSync(src, 'utf-8');
  var ast = esprima.parse(str, {
    attachComment: true
  });

  var result = estraverse.replace(ast, {
    leave: function(node, parent){
      if(node.type === 'Identifier' && node.name === '__module_id'){
        return {
            type: 'Literal',
            value: id,
            raw: id
        };
      }else if(node.type === 'CallExpression' && node.callee.type === 'Identifier'){
        if(node.callee.name === '__class'){
          return {
              type: 'Literal',
              value: '.' + sid + '-' + node.arguments[0].value,
              raw: '.' + sid + '-' + node.arguments[0].value
          };
        }else if(node.callee.name === '__id' || node.callee.name === '__instance'){
          var prefix = node.callee.name === '__id' ? '#' : '';

          return {
              type: 'BinaryExpression',
              operator: '+',
              left: {
                type: 'BinaryExpression',
                operator: '+',
                left: {
                  type: 'Literal',
                  value: prefix + sid + '-',
                  raw: prefix + sid + '-'
                },
                right: {
                  type: 'Identifier',
                  name: 'instance'
                }
              },
              right: {
                type: 'Literal',
                value: '-' + node.arguments[0].value,
                raw: '-' + node.arguments[0].value
              }
          };
        }else if(node.callee.name === '__src'){
          var filepath = file.get(node.arguments[0].value, {
            basedir: config.options.basedir,
            entry: '',
            ext: '',
            filename: src
          }).url();

          return {
              type: 'Literal',
              value: filepath,
              raw: filepath
          };
        }
      }
    }
  });

  return escodegen.generate(result, {
    format: {
      indent: {
        style: '  ',
        base: 0,
        adjustMultilineComment: true
      },
      newline: '\n',
      space: ' ',
      json: false,
      quotes: 'single',
    },
    comment: true
  });
}

module.exports = function(build_path, done){

  glob('**/*.js', {
    cwd: build_path,
    ignore: ['page/**/*.js'],
    realpath: true
  }, function(err, files){

    files.forEach(function(file_name){
      efs.outputFileSync(get_script_dist(file_name), compile_script(file_name));
    });

    console.info('success - compile script');
    done();
  });
};