/**
 * 提供模块信息
 * @author: SimonHao
 * @date:   2015-11-03 11:10:34
 */

'use strict';

var extend = require('extend');


/**
 * 默认模块信息
 * @type {Object}
 */
var default_module_info = {
    id: '',
    block: '',
    instance: '',
    spage: false,
    model: 'sync',
    config: {},
    options: {},
    modules: [],
    container: ''
};

/**
 * 格式化模块信息
 * 模块的spage,model,block属性会继承父模块的
 * @param  {Object} module_info 模块信息
 * @param  {Object} parent_info 父模块信息
 * @return {Object}             格式化之后的模块信息
 */
function format_module_info(module_info, parent_info){
    var parent_info = extend({}, default_module_info, parent_info);

    var new_module_info = extend({}, default_module_info, {
        block: parent_info.block,
        spage: parent_info.spage,
        model: parent_info.model
    }, module_info);

    new_module_info.modules = [];
    new_module_info.container = parent_info.id + (parent_info.instance ? ('/' + parent_info.instance + '/') : '/') + new_module_info.block;

    var sub_modules = module_info.modules || [];

    sub_modules.forEach(function(sub_module_info){
        new_module_info.modules.push(format_module_info(sub_module_info, new_module_info));
    });

    return new_module_info;
};

exports.format = format_module_info;


