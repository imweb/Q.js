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
                    var readFilters = self._makeReadFilters(descriptor.filters, self.data(namespace)),
                        key = descriptor.target,
                        target = _.get(namespace, key),
                        update = _.isObject(directive) ? directive.update : directive,
                        that = _.extend({
                            el: node,
                            vm: self,
                            data: function (key) {
                                return self.data(_.get(namespace, key));
                            },
                            namespace: namespace,
                            setting: setting
                        }, descriptor, {
                            filters: readFilters
                        }),
                        tmp = that.data(key);

                    update && self.$watch(target, function (value, oldValue) {
                        value = self.applyFilters(value, readFilters, oldValue);
                        update.call(that, value, oldValue);
                    }, typeof tmp === 'object', _.alpaca ? false : typeof options.immediate === 'boolean' ? options.immediate : (tmp !== undefined));
                    if (_.isObject(directive) && directive.bind) directive.bind.call(that);
                });
        });
    });
};
