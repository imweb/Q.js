// Modules map
var modules = {},
    mergeOptions = require('./strats').mergeOptions,
    define = window.define,
    require = window.require,
    _define,
    _require;

if (define && require) {
    _define = function (name, options) {
        var res = this.extend(options);
        define(name, res);
        return res;
    };
    _require = function (name, callback) {
        return require(name, callback);
    };
} else {
    _define = function (name, options) {
        modules[name] = this.extend(options);
        return modules[name];
    };
    _require = function (name, callback) {
        var self = this;
        if (callback)
            return callback.apply(
                window,
                name.map(function (name) { return modules[name] || self; })
            );
        return modules[name] || this;
    };
}

function _extend(extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this,
        Sub = createClass(extendOptions.name || 'QComponent');
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.options = mergeOptions(
        Super.options,
        extendOptions
    );
    Sub['super'] = Super;
    Sub.extend = Super.extend;
    Sub.get = Super.get;
    Sub.all = Super.all;
    return Sub;
}

function createClass (name) {
    return new Function(
        'return function ' + name +
        ' (options) { this._init(options) }'
    )();
}

module.exports = {
    /**
     * define
     * define a component
     * @param {String} name
     * @param {Object} options
     */
    define: _define,
    /**
     * require
     * require(name)
     * require(names, callback)
     * require a component
     * @param {String} name
     * @param {Array} names
     * @param {Function} callback
     */
    require: _require,
    /**
     * extend
     * extend the class
     * @param {Object} options
     */
    extend: _extend
};
