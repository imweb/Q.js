var DELEGATOR_CALLBACKS_KEY = '__cbs__',
    NO_DELEGATOR = {
        // prevent mouseover trigger more than one time
        mouseover: true,
        change: true,
        input: true,
        porpertychange: true
    };
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

function contains(a, b) {
    return a !== b && a.contains(b);
}

function data(el, key, value) {
    var uid = el[_expando] = el[_expando] || ++_uid,
        data = _map[uid] = _map[uid] || {};
    // set Data
    if (value === undefined) return data[key];
    return (data[key] = value);
}

function add(el, evt, fn) {
    evt.split(' ').forEach(function (e) {
        el.addEventListener(e, fn, false);
    });
}

module.exports = {
    find: function (selector) {
        return this.slice.call(document.querySelectorAll(selector), 0);
    },
    contains: contains,
    data: data,
    cleanData: function (els) {
        var uid
        els.forEach(function (el) {
            var uid = el[_expando];
            // has data
            uid && (uid in _map) &&
                (delete _map[uid]);
        });
    },
    add: function (el, evt, fn, vm) {
        if (!vm || NO_DELEGATOR[evt]) {
            add(el, evt, fn);
        } else {
            var $el = vm.$el,
                cbs = data($el, DELEGATOR_CALLBACKS_KEY);
            if (!cbs) {
                cbs = [];
                data($el, DELEGATOR_CALLBACKS_KEY, cbs);
                add($el, evt, function (e) {
                    var target = e.target
                    cbs.forEach(function (cb) {
                        var fn = cb.fn,
                            el = cb.el;
                        if (contains(el, target)) {
                            fn.call(el, e);
                        }
                    });
                });
            }
            // push
            cbs.push({
                el: el,
                fn: fn
            });
        }
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
