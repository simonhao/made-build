/**
 * 打包样式
 * @author: SimonHao
 * @date:   2015-11-02 14:26:19
 */

'use strict';

var path   = require('path');
var fs     =  require('fs');
var glob   = require('glob');
var page   = require('made-build-page');
var file   = require('made-build-file');
var pack   = require('made-pack-style');
var config = require('made-config');
var efs    = require('fs-extra');
var async  = require('async');

var comm_options = config.get('comm');
var pack_options = config.get('pack/style');

function find_external(pack_name_list){
  var external_list = [];

  var pack_name_list = pack_name_list || [];

  pack_name_list.forEach(function(pack_name){
    var pack_detail;

    if(pack_name in pack_options){
      pack_detail = pack_options[pack_name];

      external_list = external_list.concat(pack_detail.modules || []);
    }else{
      console.error('no external style pack', pack_name);
    }
  });

  return external_list;
}

var func_list = {
};

function pack_external(info, done){
  var pack_name = info.pack;

  var pack_info = {
    basedir: comm_options.path.base,
    filename: info.src,
    func: func_list,
    require: [],
    external: []
  };

  var pack_detail;

  if(pack_name in pack_options){
    pack_detail = pack_options[pack_name];

    pack_info.require = pack_detail.modules;
    pack_info.external = find_external(pack_detail.external);
  }else{
    console.log('no style pack', pack_name);
  }

  pack(pack_info, done);
}

function pack_page(info, done){
  var module_list = info.require;
  var external_list = info.external;

  var pack_info = {
    basedir: comm_options.path.base,
    filename: info.src,
    func: func_list,
    require: module_list || [],
    external: find_external(external_list) || []
  };

  pack(pack_info, done);
}

function pack_style(style_info, done){
  async.eachSeries(style_info, function(pack_info, next){
    var file_info;

    if(pack_info.pack){
      if(!file.has(pack_info.src)){
        file_info = file.set(pack_info.src);

        pack_external(pack_info, function(err, style){
          if(!err){
            efs.outputFileSync(file_info.dist(), style);
            next();
          }
        });
      }else{
        next();
      }
    }else if(pack_info.require){
      pack_page(pack_info, function(err, style){
        if(!err){
          efs.outputFileSync(file.set(pack_info.src).dist(), style);
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
        pack_style(page.set(file_name).style(), next);
      }, function(err){
        console.info('· success - pack style');
        done();
      });
    });
  }else{
    done();
  }
};