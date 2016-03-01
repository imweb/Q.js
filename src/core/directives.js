var _ = require('./utils'),
    strats = require('./strats');

var PROP_REG = /^(.*)\.([\w\-]+)$/

function _setProp(vm, prop, value) {
    vm.data(prop, value);
}

module.exports = {
    cloak: {
        bind: function () {
            var vm = this.vm,
                el = this.el;

            // after ready
            vm.$once('hook:ready', function () {
                // if data change
                vm.$once('datachange', function () {
                    el.removeAttribute('q-cloak');
                });
            });
        }
    },
    show: function (value) {
        var el = this.el;
        if (value) el.style.display = 'block';
        else el.style.display = 'none';
    },
    'class': function (value) {
        var el = this.el,
            arg = this.arg;
        if (arg) {
            value ?
                _.addClass(el, arg) :
                _.removeClass(el, arg);
        } else {
            if (this.lastVal) {
                _.removeClass(el, this.lastVal);
            }
            if (value) {
                _.addClass(el, value);
                this.lastVal = value;
            }
        }
    },
    value: function (value) {
        var el = this.el;
        if (el.type === 'checkbox') {
            el.checked = value;
        } else {
            el.value = value;
        }
    },
    attr: function (value) {
        if (value === undefined) return;
        var arg = this.arg,
            el = this.el;
        // property
        if (arg === 'style') {
            if (typeof value === 'object') {
                for (var k in value) {
                    if (value.hasOwnProperty(k)) {
                        el.style[k] = value[k];
                    }
                }
            } else {
                el.setAttribute(arg, value);
            }
        } else {
            if (arg in el) {
                el[arg] = value;
            } else {
                el.setAttribute(arg, value);
            }
        }
    },
    text: function (value) {
        var text;
        value !== undefined &&
            (text = (typeof this.el.textContent === 'string') ?
                'textContent' : 'innerText') &&
                (this.el[text] =
                    value == null ?
                        '' :
                        value.toString());
    },
    html: function(value) {
        this.el.innerHTML = value && value.toString() || '';
    },
    on: {
        bind: function () {
            var self = this,
                key = this.target,
                param = this.param,
                filters = this.filters,
                vm = this.vm,
                handler = vm.applyFilters(this.vm[key], filters),
                data = param && (~param.indexOf('this')) && self.data();
            _.add(this.el, this.arg, function (e) {
                if (!handler || typeof handler !== 'function') {
                    return _.warn('You need implement the ' + key + ' method.');
                }
                var args = [];
                param ?
                    param.forEach(function (arg) {
                        if (arg === 'e') args.push(e);
                        else if (arg === 'this') args.push(data);
                        else if (arg.match(/^(['"]).*\1$/)) args.push(arg.slice(1, -1));
                        else args.push(self.data(arg));
                    }) :
                    args.push(e);

                handler.apply(vm, args);
            });
        }
    },
    model: {
        bind: function () {
            var key = this.target,
                namespace = this.namespace || '',
                el = this.el,
                vm = this.vm,
                data = vm.data(namespace),
                composing = false;
            _.add(el, 'input propertychange change', function (e) {
                if (composing) return;
                data.$set(key, el.value);
            }, vm);
            _.add(el, 'compositionstart', function (e) {
                composing = true;
            });
            _.add(el, 'compositionend', function (e) {
                composing = false;
            });
        },
        update: function (value) {
            this.el.value = value;
        }
    },
    vm: {
        bind: function () {
            // stop walk
            this.setting.stop = true;

            // which component
            var name = this.target,
                vm = this.vm,
                el = this.el,
                // component reference
                ref = el.getAttribute('q-ref') || false,
                key = el.getAttribute('q-with') || '',
                namespace = this.namespace,
                target = _.get(namespace, key),
                data = vm.data(target),
                Child = vm.constructor.require(name),
                mergeTarget = Child.options.data,
                options,
                childVm;

            // merge data
            mergeTarget &&
                data ?
                    Object.keys(mergeTarget).forEach(function (key) {
                        key in data ||
                        data.$set(key, mergeTarget[key]);
                    }) :
                    (data = vm.data(target, mergeTarget));

            options = {
                el: el,
                // TODO maybe need to remove
                data: data.$get(),
                _parent: vm
            };

            childVm = new Child(options);

            vm._children.push(childVm);
            ref && !function () {
                var refs = vm.$[ref];
                refs ?
                    refs.length ?
                        (refs.push(childVm)) :
                        (vm.$[ref] = [refs, childVm]) :
                    (vm.$[ref] = childVm);
            }();

            // prevent child vm data change to trigger parent vm
            var _preventChild = false,
            // prevent parent vm data change to trigger child vm
                _preventParent = false,
            // data cache
                dataCache;

            // first trigger
            target &&
                vm.$watch(target, function (value, oldVal, patch) {
                    if (_preventParent && target === _preventParent) return;
                    // cache the data when target change
                    dataCache = value;
                });

            function ondatachange(prop, value, oldVal, patch) {
                // TODO
                if (data.__R__) return vm.$off('datachange', ondatachange);
                if (this === childVm) {
                    if (_preventChild && prop === _preventChild) {

                        _preventChild = false;
                    } else {
                        var parentProp = _.get(data.$namespace(), prop);
                        // prevent parent datachange
                        _preventParent = parentProp;
                        patch ?
                            vm.data(parentProp)[patch.method].apply(vm.data(parentProp), patch.args) :
                            _setProp(vm, parentProp, value);
                    }
                } else if (this === vm) {
                    if (_preventParent) {
                        // this prevent this time
                        _preventParent = false;
                    // change data need sync
                    // TODO
                    } else if (!target || (prop !== target && !prop.indexOf(target + '.'))) {
                        var start = target.length,
                            childProp;

                        start && (start += 1);
                        childProp = prop.substring(start, prop.length);
                        // prevent child datachange
                        _preventChild = childProp;

                        patch ?
                            childVm.data(childProp)[patch.method].apply(childVm.data(childProp), patch.args) :
                        _setProp(childVm, childProp, value);
                    // maybe not need sync, check data cache if exist just sync
                    } else if (!target.indexOf(prop) && dataCache) {
                        // prevent child datachange
                        _preventChild = target;

                        childVm.$set(dataCache);
                        // clear the data cache
                        dataCache = undefined;
                    }
                }
            }

            // second trigger
            vm.$on('datachange', ondatachange);
        }
    },
    'if': {
        bind: function () {
            // return if el is a template
            if (!this.el.parentNode) return;

            var tpl = this.el,
                parentNode = tpl.parentNode,
                ref = document.createComment('q-if'),
                hasInit = false,
                exist = true,
                key = this.target,
                namespace = this.namespace,
                target = namespace ? ([namespace, key].join('.')) : key,
                readFilters = this.filters,
                data = this.data(),
                vm = this.vm;

            this.setting.stop = true;

            vm.$watch(target, function (value, oldVal) {
                value = vm.applyFilters(value, readFilters, oldVal);
                if (!hasInit && value === true) {
                    hasInit = true;
                    vm._templateBind(tpl, {
                        data: data,
                        namespace: namespace,
                        immediate: true
                    });
                }
                // need to init
                if (value === exist) return;
                // bind
                if (value === true) {
                    parentNode.replaceChild(tpl, ref);
                    exist = value;
                // unbind
                } else if (value === false) {
                    parentNode.replaceChild(ref, tpl);
                    exist = value;
                }
            }, false, true);
        }
    },
    el: {
        bind: function () {
            this.vm.$$[this.target] = this.el;
        }
    },
    repeat: require('./repeat')
};
