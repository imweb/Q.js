var $ = require('zepto'),
    _extend = $.extend,
    _expando = 'QDataUid',
    _uid = 0,
    _map = {};

module.exports = {
    find: $,
    contains: $.contains,
    data: function (el, key, value) {
        var uid = el[_expando] = el[_expando] || ++_uid,
            data = _map[uid] = _map[uid] || {};
        // set Data
        if (value === undefined) return data[key];
        return (data[key] = value);
    },
    // TODO
    cleanData: function () {},
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
