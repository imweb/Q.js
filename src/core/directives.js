var _ = require('./utils'),
    strats = require('./strats');

var PROP_REG = /^(.*)\.([\w\-]+)$/

function _setProp(vm, prop, value) {
    if (~prop.indexOf('.')) {
        prop = PROP_REG.exec(prop);
        vm.data(prop[1]).$set(prop[2], value);
    } else {
        vm.$set(prop, value);
    }
}

module.exports = {
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
        value !== undefined &&
            (this.el.textContent =
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
            // remove q-vm
            this.el.removeAttribute('q-vm');
            // stop walk
            this.setting.stop = true;

            // which component
            var name = this.target,
                vm = this.vm,
                el = this.el,
                // component reference
                ref = el.getAttribute('q-ref') || false,
                key = el.getAttribute('q-with') || '',
                extend = el.getAttribute('q-extend'),
                namespace = this.namespace,
                target = namespace ? ([namespace, key].join('.')) : key,
                data = vm.data(target),
                Child = vm.constructor.require(name),
                mergeTarget = Child.options.data,
                options,
                childVm;

            // merge data
            mergeTarget &&
                Object.keys(mergeTarget).forEach(function (key) {
                    key in data ||
                        data.$set(key, mergeTarget[key]);
                });

            options = {
                el: el,
                data: data.$get(),
                _parent: vm
            };

            if (extend && (extend = vm.$options.extend[extend])) {
                if (extend.data || extend.el || extend._parent) throw new Error('Extend Error');
                options = strats.mergeOptions(options, extend);
            }

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

            // unidirectional binding
            vm.$on('datachange', function (prop, value, oldVal, patch) {
                if (this === childVm) {
                    if (vm._preventChild) {
                        vm._preventChild = false;
                    } else {
                        // prevent parent datachange
                        this._preventParent = true;
                        var parentProp = target ? [target, prop].join('.') : prop;
                        patch ?
                            vm[parentProp][patch.method].apply(vm[parentProp], patch.args) :
                            _setProp(vm, parentProp, value);
                    }
                } else if (this === vm) {
                    if (childVm._preventParent) {
                        // this prevent this time
                        vm._preventParent = false;
                    } else if (!target || ~prop.indexOf(target)) {
                        // prevent child datachange
                        vm._preventChild = true;

                        var start = target.length,
                            childProp;

                        start && (start += 1);
                        childProp = prop.substring(start, prop.length);
                        patch ?
                            childVm[childProp][patch.method].apply(childVm[childProp], patch.args) :
                        _setProp(childVm, childProp, value);
                    }
                }
            });
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
    repeat: require('./repeat')
};
