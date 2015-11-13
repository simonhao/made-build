/**
 * 打包脚本
 * @author: SimonHao
 * @date:   2015-11-02 14:25:31
 */

'use strict';

var path   = require('path');
var fs     =  require('fs');
var glob   = require('glob');
var page   = require('made-build-page');
var pack   = require('made-pack-script');
var file   = require('made-build-file');
var config = require('made-config');
var efs    = require('fs-extra');
var async  = require('async');

var comm_options = config.get('comm');
var pack_options = config.get('pack/script');

function find_external(pack_name_list){
  var external_list = [];

  var pack_name_list = pack_name_list || [];

  pack_name_list.forEach(function(pack_name){
    var pack_detail;

    if(pack_name in pack_options){
      pack_detail = pack_options[pack_name];

      external_list = external_list.concat(pack_detail.entry || []);
      external_list = external_list.concat(pack_detail.require || []);
    }else{
      console.error('no external script pack', pack_name);
    }
  });

  return external_list;
}

function pack_external(pack_name, done){
  var pack_info = {
    basedir: file.temp('script'),
    entry: [],
    require: [],
    external: []
  };

  var pack_detail;

  if(pack_name in pack_options){
    pack_detail = pack_options[pack_name];

    pack_info.entry = pack_detail.entry;
    pack_info.require = pack_detail.require;
    pack_info.external = find_external(pack_detail.external);
  }else{
    console.log('no script pack', pack_name);
  }

  pack(pack_info, done);
}

function pack_page(module_list, external_list, done){
  var pack_info = {
    basedir: file.temp('script'),
    entry: [],
    require: module_list || [],
    external: find_external(external_list) || []
  };

  pack(pack_info, done);
}

function pack_script(script_info, done){
  async.eachSeries(script_info, function(pack_info, next){
    var file_info;

    if(pack_info.pack){
      if(!file.has(pack_info.src)){
        file_info = file.set(pack_info.src);

        pack_external(pack_info.pack, function(err, script){
          if(!err){
            efs.outputFileSync(file_info.dist(), script);
            next();
          }
        });
      }else{
        next();
      }
    }else if(pack_info.require){
      pack_page(pack_info.require, pack_info.external, function(err, script){
        if(!err){
          efs.outputFileSync(file.set(pack_info.src).dist(), script);
          next();
        }
      });
    }
  }, done);
}

module.exports = function(build_path, build_model, done){
  var page_path = path.join(build_path, '/page');

  if(fs.existsSync(page_path) && fs.statSync(page_path).isDirectory()){
    glob('**/*.js', {
      cwd: page_path,
      realpath: true
    }, function(err, files){
      async.eachSeries(files, function(file_name, next){
        pack_script(page.set(file_name).script(), next);
      }, function(err){
        console.info('· success - compile page');
        done();
      });
    });
  }else{
    done();
  }
};