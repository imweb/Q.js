var _ = require('./utils');
    methods = {
        'default': {
            // how to clean the dom
            clean: function (parentNode, repeats) {
                if (repeats.length) {
                    repeats.forEach(function (node) {
                        // repeat element may has been remove
                        node.parentNode === parentNode &&
                            parentNode.removeChild(node);
                    });
                    _.cleanData(repeats);
                    repeats.length = 0;
                }
            },
            insert: function (parentNode, fragment, ref) {
                parentNode.insertBefore(fragment, ref);
            }
        },
        push: {
            insert: function (parentNode, fragment, ref) {
                parentNode.insertBefore(fragment, ref);
            },
            dp: function (data, patch) {
                return patch.args;
            }
        },
        splice: {
            clean: function (parentNode, repeats, value, watchers, target) {
                var i = value[0],
                    l = value[1],
                    eles = repeats.splice(i, l);
                eles.forEach(function (ele) {
                    parentNode.removeChild(ele);
                });
                splice(watchers, target, i, l);
                return true;
            },
            dp: function (data, patch) {
                return patch.args;
            }
        }
    };


function splice(watchers, target, i, l) {
    var length = target.length,
        subKey,
        cur,
        index,
        newKey;
    Object.keys(watchers).forEach(function (key) {
        if (~key.indexOf(target)) {
            subKey = key.substring(length + 1);
            cur = subKey.split('.');
            if (cur.length) {
                index = +cur.shift();
                if ((index -= l) >= i) {
                    cur.unshift(index);
                    cur.unshift(target);
                    newKey = cur.join('.');
                    watchers[newKey] = watchers[key];
                    delete watchers[key];
                }
            }
        }
    });
}

exports.bind = function () {
    var tpl = this.el,
        setting = this.setting,
        parentNode = tpl.parentNode,
        key, namespace, target, readFilters, repeats, ref, vm;
    // return
    if (!parentNode || setting.stop) return;

    // remove repeat mark
    tpl.removeAttribute('q-repeat');
    setting.stop = true;

    key = this.target;
    namespace = this.namespace;
    target = namespace ? ([namespace, key].join('.')) : key;
    readFilters = this.filters;
    repeats = [];
    ref = document.createComment('q-repeat');
    vm = this.vm;

    parentNode.replaceChild(ref, tpl);
    // cache tpl
    _.walk([tpl], _.noop, { useCache: true });

    vm.$watch(target, function (value, oldVal, patch) {
        value = vm.applyFilters(value, readFilters);
        var method = patch ? patch.method : 'default',
            clean = (methods[method] || {}).clean,
            insert = (methods[method] || {}).insert,
            dp = (methods[method] || {}).dp;

        // if dp exists and readFilters.length === 0, proceess data
        dp && !readFilters.length ?
            (value = dp(value, patch)) : (clean = methods['default'].clean);

        _.nextTick(function () {
            // clean up repeats dom
            if (clean && clean(parentNode, repeats, value, vm._watchers, target) === true) {
                return;
            }

            var fragment = document.createDocumentFragment(),
                itemNode;
            value.forEach(function (obj, i) {
                itemNode = _.clone(tpl);
                vm._templateBind(itemNode, {
                    data: obj,
                    namespace: obj.$namespace(),
                    immediate: true,
                    useCache: true
                });
                // TODO this must refactor
                repeats.push(itemNode);
                fragment.appendChild(itemNode);
            });

            insert && insert(parentNode, fragment, ref);
            vm.$emit('repeat-render');
        });
    }, false, true);
}
