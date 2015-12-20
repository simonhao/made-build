/**
 * Pack Script
 * @author: SimonHao
 * @date:   2015-12-19 15:23:32
 */

'use strict';

var path   = require('path');
var fs     = require('fs');
var glob   = require('glob');
var async  = require('async');
var efs    = require('fs-extra');
var page   = require('../../page');
var config = require('../../config');
var file   = require('../../file');
var mid    = require('made-id');
var pack   = require('made-pack-script');

var comm_options = config.get('comm');
var pack_config  = config.get('pack/script');

var script_transform = {
  __src: function(val, sid, options){
    var file_info = file.search(val[0], {
      basedir: options.basedir,
      filename: options.filename,
      entry: '',
      ext: ''
    });

    if(file_info){
      return file_info.url();
    }else{
      console.error('No find file: "', val[0], '" from file', options.filename);
      return val[0];
    }
  }
};

var template_transform = {

};

function find_external(pack_name){
  var external_list = [];

  if(pack_name in pack_config){
    external_list = external_list.concat(pack_config[pack_name].entry || []);
    external_list = external_list.concat(pack_config[pack_name].require || []);
  }

  return external_list;
}

function pack_external(pack_name, done){
  var entry = [];
  var require = [];
  var external = [];

  if(pack_name in pack_config){
    entry = pack_config[pack_name].entry || [];
    require = pack_config[pack_name].require || [];

    if(Array.isArray(pack_config[pack_name])){
      pack_config[pack_name].external.forEach(function(pack_name){
        external = external.concat(find_external(pack_name));
      });
    }
  }

  pack({
    basedir: comm_options.path.base,
    require: require,
    entry: entry,
    external: external,
    script_transform: script_transform,
    template_transform: template_transform
  }, done);
}

function pack_module(module_list, external_pack_list, done){
  var external_list = [];

  external_pack_list.forEach(function(pack_name){
    external_list = external_list.concat(find_external(pack_name));
  });

  var module_list = module_list.map(function(file_name){
    return mid.id(file_name, {
      basedir: comm_options.path.base,
      entry: 'index.js',
      ext: '.js'
    });
  });

  pack({
    basedir: comm_options.path.base,
    require: module_list,
    external: external_list,
    script_transform: script_transform,
    template_transform: template_transform
  }, done);
}

function pack_page(file_name, done){
  var page_info = page.set(file_name);

  async.parallel([
    function(done){
      pack_module(page_info.script_module(), Object.keys(page_info.external_script), function(script){
        efs.outputFileSync(page_info.page_script().dist(), script);
        done();
      });
    },
    function(done){
      async.forEachOf(page_info.external_script, function(file_info, pack_name, done){
        if(!file_info._build){
          file_info._build = true;

          pack_external(pack_name, function(script){
            efs.outputFileSync(file_info.dist(), script);
            done();
          });
        }else{
          done();
        }
      }, done);
    }
  ], done);
}

module.exports = function(build_path, model, done){
  var page_path = path.join(build_path, '/page');
  var files;

  if(fs.existsSync(page_path) && fs.statSync(page_path).isDirectory()){
    files = glob.sync('**/*.jade', {
      cwd: page_path,
      realpath: true
    });

    async.eachSeries(files, function(file_name, next){
      pack_page(file_name, next);
    }, done);
  }else{
    done();
  }
};