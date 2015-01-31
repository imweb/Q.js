var $ = require('zepto'),
    _extend = $.extend;

module.exports = {
    find: $,
    contains: $.contains,
    data: function (el, key, value) {
        return $(el).data(key, value);
    },
    cleanData: function (eles) {
        for (var i = 0, l = eles.length; i < l; i++) {
            $(eles[i]).removeData();
        }
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
