var _ = require('./utils');

module.exports = {
    show: function (value) {
        var el = this.el;
        if (value) el.style.display = 'block';
        else el.style.display = 'none';
    },
    'class': function (value) {
        var el = this.el,
            arg = options.arg;
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
    text: function (value) {
        value !== undefined &&
            (this.el.innerText = value);
    },
    on: {
        unwatch: true,
        bind: function () {
            var key = this.target || this.exp.match(/^[\w\-]+/)[0],
                expression = this.exp,
                filters = this.filters,
                vm = this.vm,
                handler = vm.applyFilters(this.vm[key], filters),
                data = this.namespace ?
                    vm.data(namespace) :
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
            _.add(node, 'input onpropertychange change', function (e) {
                vm.data(namespace).$set(key, el.value);
            });
        },
        update: function (value) {
            el.value = value;
        }
    }
};
