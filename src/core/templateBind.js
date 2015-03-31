var parse = require('./parse'),
    _ = require('./utils');

module.exports = function (el, options) {
    options = options || {};

    var self = this,
        directives = self.$options.directives,
        index = options.index,
        data = options.data || self,
        namespace = options.namespace;

    _.walk([el], function (node, res, setting) {
        res.forEach(function (obj) {
            var name = obj.name.substring(2),
                directive = directives[name],
                descriptors = parse(obj.value);
            directive &&
                descriptors.forEach(function (descriptor) {
                    var readFilters = self._makeReadFilters(descriptor.filters),
                        key = descriptor.target,
                        target = namespace ? ([namespace, key].join('.')) : key,
                        update = _.isObject(directive) ? directive.update : directive,
                        init = _.isObject(directive) ? directive.init : undefined,
                        that = _.extend({
                            el: node,
                            vm: self,
                            namespace: namespace,
                            setting: setting,
                        }, descriptor, {
                            filters: readFilters
                        });

                    if (init) return init.call(that);

                    update && self.$watch(target, function (value) {
                        value = self.applyFilters(value, readFilters);
                        update.call(that, value);
                    }, typeof data[key] === 'object', options.immediate || (data[key] !== undefined));
                    if (_.isObject(directive) && directive.bind) directive.bind.call(that);
                });

            // // directive is repeat
            // name === 'repeat' &&
            //     // has parentNode, so this is not a template
            //     node.parentNode &&
            //     // just stop
            //     (setting.stop = true) &&
            //         descriptors.forEach(function (descriptor) {
            //             var key = descriptor.target,
            //                 target = namespace ? ([namespace, key].join('.')) : key,
            //                 readFilters = self._makeReadFilters(descriptor.filters),
            //                 repeats = [],
            //                 tpl = node,
            //                 ref = document.createComment('q-repeat'),
            //                 parentNode = node.parentNode;
            //             parentNode.replaceChild(ref, tpl);
            //             _walk([tpl], _.noop, {
            //                 useCache: true
            //             });
            //             readFilters.push(function (arr) {
            //                 if (repeats.length) {
            //                     repeats.forEach(function (node) {
            //                         // repeat element may has been remove
            //                         node.parentNode === parentNode &&
            //                             parentNode.removeChild(node);
            //                     });
            //                     _.cleanData(repeats);
            //                     repeats.length = 0;
            //                 }
            //                 var fragment = document.createDocumentFragment(),
            //                     itemNode;
            //                 arr.forEach(function (obj, i) {
            //                     itemNode = _.clone(tpl);
            //                     self._templateBind(itemNode, {
            //                         data: obj,
            //                         namespace: obj.$namespace(),
            //                         immediate: true,
            //                         useCache: true
            //                     });
            //                     repeats.push(itemNode);
            //                     fragment.appendChild(itemNode);
            //                 });
            //                 parentNode.insertBefore(fragment, ref);
            //             });
            //             self.$watch(target, function (value) {
            //                 _.nextTick(function () {
            //                     self.applyFilters(value, readFilters);
            //                     self.$emit('repeat-render');
            //                 });
            //             }, false, true);
            //         });
        });
    }, {
        useCache: options.useCache
    });
};
