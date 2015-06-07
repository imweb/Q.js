var $ = require('zepto'),
    _extend = $.extend,
    _expando = 'QDataUid',
    _uid = 0,
    _map = {};

module.exports = {
    find: function (selector) {
        // zepto just use document.querySelectorAll
        return this.slice.call(document.querySelectorAll(selector), 0);
    },
    contains: $.contains,
    data: function (el, key, value) {
        var uid = el[_expando] = el[_expando] || ++_uid,
            data = _map[uid] = _map[uid] || {};
        // set Data
        if (value === undefined) return data[key];
        return (data[key] = value);
    },
    cleanData: function (els) {
        var uid
        els.forEach(function (el) {
            var uid = el[_expando];
            // has data
            uid && (uid in _map) &&
                (delete _map[uid]);
        });
    },
    add: $.event.add,
    remove: $.event.remove,
    clone: function (ele) {
        return ele.cloneNode(true);
    },
    extend: function (target) {
        if (arguments.length === 1) return _extend(this, target);
        return _extend.apply(this, arguments);
    }
};
