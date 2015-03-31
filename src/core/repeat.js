var _ = require('./utils');
    methods = {
        default: {
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
            dp: function (data, action) {
                return action.args;
            }
        }
    };

exports.bind = function () {
    var tpl = this.el,
        setting = this.setting,
        parentNode = tpl.parentNode,
        key, namespace, target, readFilters, repeats, ref, vm;
    // return
    if (!parentNode || setting.stop) return;

    setting.stop = true;

    key = this.target;
    namespace = this.namespace;
    target = namespace ? ([namespace, key].join('.')) : key;
    readFilters = this.readFilters;
    repeats = [];
    ref = document.createComment('q-repeat');
    vm = this.vm;

    parentNode.replaceChild(ref, tpl);
    // cache tpl
    _.walk([tpl], _.noop, { useCache: true });

    vm.$watch(target, function (value, action) {
        value = vm.applyFilters(value, readFilters);
        var method = action ? action.method : 'default',
            clean = (methods[method] || {}).clean,
            insert = (methods[method] || {}).insert,
            dp = (methods[method] || {}).dp;

        // if dp exists and readFilters.length === 0, proceess data
        dp && !readFilters && (value = dp(value, action));

        _.nextTick(function () {
            // clean up repeats dom
            clean && clean(parentNode, repeats);

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
