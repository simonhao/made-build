/**
 * wrap
 * @author: SimonHao
 * @date:   2016-01-02 11:39:17
 */

require = (function(modules, entry){

  var prev_require = typeof require === 'function' && require;
  var cache = {};

  function new_require(module_id){
    var module;

    if(!cache[module_id]){
      if(!modules[module_id]){
        if(prev_require){
          return prev_require(module_id);
        }else{
          throw new Error('Cannot find module \'' + module_id + '\'');
        }
      }else{
        module = cache[module_id] = {exports:{}};
        modules[module_id].call(module.exports, new_require, module, module.exports);
      }
    }

    return cache[module_id].exports;
  }

  entry.forEach(function(module_id){
    new_require(module_id);
  });

  return new_require;
})({"made-view/runtime": function(require, module, exports){
/**
 * Made-View Runtime
 * @author: SimonHao
 * @date:   2015-10-09 15:11:34
 */
'use strict';
exports.encode = function (html) {
    var result = String(html).replace(/[&<>"]/g, function (escape_char) {
        var encode_map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;'
        };
        return encode_map[escape_char] || escape_char;
    });
    if (result === '' + html)
        return html;
    else
        return result;
};
exports.each = function (list, callback) {
    if (Array.isArray(list)) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    } else if (typeof list === 'object' && list !== null) {
        Object.keys(list).forEach(function (key) {
            callback(list[key], key);
        });
    } else {
        callback(list, 0);
    }
};
exports.block = function (blocks, block_name, block_content) {
    var content = blocks[block_name];
    if (content) {
        content[0] && content[0]();
        content[1] && content[1]();
        if (!content[1]) {
            block_content();
        }
        content[2] && content[2]();
    }
};
},"comm/message/alert/view.tpl": function(require, module, exports){
var made = require('made-view/runtime');
exports._default = function (__made_locals) {
    var __made_buf = [];
    var __made_block = __made_block || {};
    var __made_locals = __made_locals || {};
    ;
    (function (msg) {
        __made_buf.push('\n<div src="/../test/src/comm/message/alert/readme.md" class="comm-message-alert-wrap">\n  <h1>Tips ' + made.encode(msg) + '</h1>\n</div>');
    }(__made_locals['msg']));
    return __made_buf.join('');
};
},"comm/message/alert": function(require, module, exports){
/**
 * 弹出框
 * @author: SimonHao
 * @date:   2015-11-04 09:36:54
 */
'use strict';
var alert_template = require('comm/message/alert/view.tpl')._default;
var $ = require('jquery/dist/jquery');
exports._default = function (msg) {
    $('body').append(alert_template({ msg: msg }));
};
;
},"comm/admin/title": function(require, module, exports){
/**
 * Title
 * @author: SimonHao
 * @date:   2015-12-07 15:40:33
 */
'use strict';
var Module = require('made-module')._default;
var tips = require('comm/message/alert')._default;
var Title = __made.create_class(function Title(options, instance) {
    Module.call(this);
    document.querySelector('#comm-admin-title-' + (instance ? instance + '-' : '') + 'wrap').addEventListener('click', function (event) {
        tips('HaHa!!!!');
    });
}, [
    {
        destructor: {
            value: function () {
                Module.prototype.destructor.call(this);
            }
        }
    },
    {}
], Module);
exports._default = Title;
},"comm/admin/navbar": function(require, module, exports){
/**
 * 导航栏
 * @author: SimonHao
 * @date:   2015-11-05 14:36:10
 */
'use strict';
var Module = require('made-module')._default;
var Navbar = __made.create_class(function Navbar(options, instance) {
    Module.call(this);
    this.wrap = document.querySelector('#comm-admin-navbar-' + (instance ? instance + '-' : '') + 'wrap');
    this.bind(instance);
}, [
    {
        bind: {
            value: function (instance) {
                this.wrap.addEventListener('click', function (event) {
                    alert(instance);
                });
            }
        }
    },
    {}
], Module);
exports._default = Navbar;
},"comm/admin/frame": function(require, module, exports){
/**
 *
 * @author: SimonHao
 * @date:   2015-11-04 14:16:40
 */
'use strict';
var Module = require('made-module')._default;
var AdminFrame = __made.create_class(function AdminFrame(options, instance) {
    Module.call(this);
    this.bind(instance);
}, [
    {
        bind: {
            value: function (instance) {
                var classname = '.comm-admin-frame-wrap';
                var id = '#comm-admin-frame-' + (instance ? instance + '-' : '') + 'wrap';
                var src = '/../test/src/comm/admin/frame/readme.md';
                var instance = 'comm-admin-frame' + (instance ? '-' + instance : '') + '-top';
                console.log(classname, id, src, instance);
            }
        },
        destructor: {
            value: function () {
                Module.prototype.destructor.call(this);
            }
        }
    },
    {}
], Module);
exports._default = AdminFrame;
},"comm/admin": function(require, module, exports){
/**
 * Admin
 * @author: SimonHao
 * @date:   2015-11-17 15:05:17
 */
'use strict';
var Module = require('made-module')._default;
var Admin = __made.create_class(function Admin(options, instance) {
    Module.call(this);
}, [
    {
        load: {
            value: function (page) {
                console.log('load' + page);
            }
        },
        destructor: {
            value: function () {
                Module.prototype.destructor.call(this);
            }
        }
    },
    {}
], Module);
exports._default = Admin;
},"show/page/index": function(require, module, exports){
/**
 * 首页
 * @author: SimonHao
 * @date:   2015-12-20 14:54:09
 */
'use strict';
var Module = require('made-module')._default;
var Index = __made.create_class(function Index(options, instance) {
    Module.call(this);
    var admin = entry('comm/admin');
    admin.load(2);
}, [
    {},
    {}
], Module);
exports._default = Index;
}},[]);