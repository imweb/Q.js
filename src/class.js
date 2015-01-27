var subs = {},
    mergeOptions = require('./strats').mergeOptions;

function define(name, options) {
    subs[name] = this.extend(options);
}

function require(name) {
    return subs[name] || this;
}

function extend(extendOptions) {
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
    return Sub;
}

function createClass (name) {
    return new Function(
        'return function ' + name +
        ' (options) { this._init(options) }'
    )();
}

module.exports = {
    define: define,
    require: require,
    extend: extend
};
