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
                        that = _.extend({
                            el: node,
                            vm: self,
                            data: function (key) {
                                var arr = [];
                                namespace && arr.push(namespace);
                                key && arr.push(key);
                                return self.data(arr.join('.'));
                            },
                            namespace: namespace,
                            setting: setting
                        }, descriptor, {
                            filters: readFilters
                        });

                    update && self.$watch(target, function (value, oldValue) {
                        value = self.applyFilters(value, readFilters, oldValue);
                        update.call(that, value, oldValue);
                    }, typeof data[key] === 'object', options.immediate || (data[key] !== undefined));
                    if (_.isObject(directive) && directive.bind) directive.bind.call(that);
                });
        });
    }, {
        useCache: options.useCache
    });
};
