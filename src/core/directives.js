var _ = require('./utils');

module.exports = {
    show: function (value) {
        var el = this.el;
        if (value) el.style.display = 'block';
        else el.style.display = 'none';
    },
    'class': function (value) {
        var el = this.el,
            arg = this.arg;
        value ?
            _.addClass(el, arg) :
            _.removeClass(el, arg);
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
        if (arg in el) {
            el[arg] = value;
        } else {
            el.setAttribute(arg, value);
        }
    },
    text: function (value) {
        value !== undefined &&
            (this.el.innerText = value);
    },
    on: {
        bind: function () {
            var key = this.target || this.exp.match(/^[\w\-]+/)[0],
                expression = this.exp,
                filters = this.filters,
                vm = this.vm,
                handler = vm.applyFilters(this.vm[key], filters),
                data = this.namespace ?
                    vm.data(this.namespace) :
                    vm;
            _.add(this.el, this.arg, function (e) {
                if (!handler || typeof handler !== 'function') {
                    return _.warn('You need implement the ' + key + ' method.');
                }
                expression ?
                    handler.call(vm, data) :
                    handler.apply(vm, arguments);
            });
        }
    },
    model: {
        bind: function () {
            var key = this.target,
                namespace = this.namespace || '',
                el = this.el,
                vm = this.vm;
            _.add(el, 'input onpropertychange change', function (e) {
                vm.data(namespace).$set(key, el.value);
            }, vm);
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
                namespace = this.namespace,
                target = namespace ? ([namespace, key].join('.')) : key,
                data = vm.data(target),
                Child = vm.constructor.require(name),
                mergeTarget = Child.options.data,
                childVm;

            // merge data
            mergeTarget &&
                Object.keys(mergeTarget).forEach(function (key) {
                    !data[key] &&
                        data.$set(key, mergeTarget[key]);
                });

            childVm = new Child({
                el: el,
                data: data.$get()
            });

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
            vm.$on('datachange', function (args) {
                var prop = args[0];
                if (!target || ~prop.indexOf(target)) {
                    var start = target.length,
                        childProp;

                    start && (start += 1);
                    childProp = prop.substring(start, prop.length);
                    childVm.$set(childProp, args[1]);
                }
            });
        }
    },
    'if': {
        bind: function () {
            var tpl = this.el,
                parentNode = tpl.parentNode,
                ref = document.createComment('q-if'),
                hasInit = false,
                exist = false,
                key = this.target,
                namespace = this.namespace,
                target = namespace ? ([namespace, key].join('.')) : key,
                readFilters = this.filters,
                data = this.data(),
                vm = this.vm;

            tpl.removeAttribute('q-if');
            this.setting.stop = true;
            parentNode.replaceChild(ref, tpl);

            vm.$watch(target, function (value, oldVal) {
                value = vm.applyFilters(value, readFilters, oldVal);
                // need to init
                if (value === exist) return;
                // bind
                if (value === true) {
                    parentNode.replaceChild(tpl, ref);
                    !hasInit && vm._templateBind(tpl, {
                        data: data,
                        namespace: namespace,
                        immediate: true
                    });
                    exist = value;
                // unbind
                } else if (value === false) {
                    parentNode.replaceChild(ref, tpl);
                    exist = value;
                }
            });
        }
    },
    repeat: require('./repeat')
};
