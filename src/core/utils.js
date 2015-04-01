var noop = function () {},
    defer = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        setTimeout,
    cache = new (require('./cache'))(1000),
    _qtid = 0;

function walk($el, cb, setting) {
    var i, j, l, el, atts, res, qtid;
    for (i = 0; el = $el[i++];) {
        if (el.nodeType === 1) {
            if (
                setting.useCache &&
                    (qtid = el.getAttribute('qtid')) &&
                    (res = cache.get(qtid))
            ) {
                el.removeAttribute('qtid');
            } else {
                atts = el.attributes;
                l = atts.length;
                res = [];
                for (j = 0; j < l; j++) {
                    atts[j].name.indexOf('q-') === 0 &&
                        res.push({
                            name: atts[j].name,
                            value: atts[j].value
                        })
                }
                if (setting.useCache && !qtid) {
                    qtid = qtid || ++_qtid;
                    el.setAttribute('qtid', qtid);
                    cache.put(qtid, res);
                }
            }
            res.length > 0 &&
                cb(el, res, setting);
        }
        if (el.childNodes.length && !setting.stop) walk(el.childNodes, cb, setting);
        // reset stop
        setting.stop = false;
    }
}

module.exports = {
    slice: [].slice,
    noop: noop,
    /**
     * Add class with compatibility for IE & SVG
     *
     * @param {Element} el
     * @param {Strong} cls
     */
    addClass: function (el, cls) {
        if (el.classList) {
            el.classList.add(cls);
        } else {
            var cur = ' ' + (el.getAttribute('class') || '') + ' ';
            if (cur.indexOf(' ' + cls + ' ') < 0) {
                el.setAttribute('class', trim((cur + cls)));
            }
        }
    },
    /**
     * Remove class with compatibility for IE & SVG
     *
     * @param {Element} el
     * @param {Strong} cls
     */
    removeClass: function (el, cls) {
        if (el.classList) {
            el.classList.remove(cls);
        } else {
            var cur = ' ' + (el.getAttribute('class') || '') + ' ',
                tar = ' ' + cls + ' ';
            while (cur.indexOf(tar) >= 0) {
                cur = cur.replace(tar, ' ');
            }
            el.setAttribute('class', trim(cur));
        }
    },
    noexist: function (name) { throw new Error('Filter ' + name + ' hasn\'t implemented.'); },
    warn: function () {
        return (window.console && console.error) ? function (msg) {
                console.error(msg);
            } : noop;
    },
    isObject: function (o) {
        return typeof o === 'object';
    },
    nextTick: function (cb, ctx) {
        ctx ?
            defer(function () { cb.call(ctx) }, 0) :
            defer(cb, 0);
    },
    walk: walk
};
