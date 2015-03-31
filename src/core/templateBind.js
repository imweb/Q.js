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
        });
    }, {
        useCache: options.useCache
    });
};
