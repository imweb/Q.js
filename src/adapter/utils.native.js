var _extend = function (target, srcs) {
        srcs = [].splice.call(arguments, 1);
        var i = 0, l = srcs.length, src, key;
        for (; i < l; i++) {
            src = srcs[i];
            for (key in src) {
                target[key] = src[key];
            }
        }
        return target;
    },
    _expando = 'QDataUid',
    _uid = 0,
    _map = {};

module.exports = {
    find: function (selector) {
        return this.slice.call(document.querySelectorAll(selector), 0);
    },
    contains: function (a, b){
        return a !== b && a.contains(b);
    },
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
    add: function (el, evt, fn) {
        el.addEventListener(evt, fn, false);
    },
    remove: function (el, evt, fn) {
        el.removeEventListener(evt, fn, false);
    },
    clone: function (ele) {
        return ele.cloneNode(true);
    },
    extend: function (target) {
        if (arguments.length === 1) return _extend(this, target);
        return _extend.apply(this, arguments);
    }
};
