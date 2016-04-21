var _ = require('./utils'),
    strats = require('./strats');

var PROP_REG = /^(.*)\.([\w\-]+)$/

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
        if (value) {
            el.style.display = '';
            var display = el.currentStyle ?
                el.currentStyle.display :
                    getComputedStyle(el, null).display;
            if (display === 'none') {
                el.style.display = 'block';
            }
        } else {
            el.style.display = 'none';
        }
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
                        else if (arg === 'true') args.push(true);
                        else if (arg === 'false') args.push(false);
                        else if (+arg + '' === arg) args.push(+arg);
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
            var keys = ((this.namespace ? this.namespace + '.' : '') + this.target).split('.'),
                key = keys.pop(),
                namespace = keys.join('.'),
                el = this.el,
                vm = this.vm,
                data = vm.data(namespace),
                composing = false;
            _.add(el, 'input propertychange change', function (e) {
                if (composing) return;
                data.$set(key, el.value);
            });
            _.add(el, 'compositionstart', function (e) {
                composing = true;
            });
            _.add(el, 'compositionend', function (e) {
                composing = false;
            });
        },
        update: function (value) {
            if (this.el.value !== value) {
                this.el.value = value;
            }
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
                Child = vm.constructor.require(name),
                data = Child.options.data,
                options,
                childVm;

            options = {
                el: el,
                data: data,
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
                target = _.get(namespace, key),
                readFilters = this.filters,
                data = this.data(),
                vm = this.vm;

            this.setting.stop = true;

            function _init(value) {
                // no exist no bind
                if (hasInit || !exist || !value) return;
                hasInit = true;
                vm._templateBind(tpl, {
                    data: data,
                    namespace: namespace,
                    immediate: true
                });
            }

            vm.$watch(target, function (value, oldVal) {
                value = vm.applyFilters(value, readFilters, oldVal);

                _init(value);
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

                _init(value);
            }, typeof this.data(key) === 'object', true);
        }
    },
    el: {
        bind: function () {
            this.vm.$$[this.target] = this.el;
        }
    },
    repeat: require('./repeat')
};
