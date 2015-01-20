var parse = require('./parse'),
    _ = require('./utils'),
    cache = new (require('./cache'))(1000),
    _qtid = 0;

function _walk($el, cb, isTemplate, isFirst) {
    var i, j, l, el, atts, res, qtid;
    for (i = 0; el = $el[i++];) {
        if (el.nodeType === 1) {
            if (
                isTemplate &&
                    (qtid = el.getAttribute('qtid')) &&
                    (res = cache.get(qtid))
            ) {
                el.removeAttribute('qtid');
            } else {
                atts = el.attributes;
                l = atts.length;
                res = [];
                for (j = 0; j < l; j++) {
                    atts[j].name.indexOf('q-') === 0 &&
                        res.push({
                            name: atts[j].name,
                            value: atts[j].value
                        })
                }
                qtid = qtid || ++_qtid;
                el.setAttribute('qtid', qtid);
                cache.put(qtid, res);
            }
            res.length > 0 &&
                cb(el, res, isFirst);
        }
        if (el.childNodes.length) _walk(el.childNodes, cb, isTemplate);
    }
}

module.exports = function (el, options) {
    options = options || {};

    var self = this,
        directives = self.$options.directives,
        index = options.index,
        data = options.data || self,
        namespace = options.namespace;

    _walk([el], function (node, res, isFirst) {
        res.forEach(function (obj) {
            var name = obj.name.substring(2),
                directive = directives[name],
                descriptors = parse(obj.value);
            directive &&
                descriptors.forEach(function (descriptor) {
                    var readFilters = self._makeReadFilters(descriptor.filters),
                        key = descriptor.target,
                        target = namespace ? ([namespace, key].join('.')) : key,
                        update = directive.update || directive,
                        that = _.extend({
                            el: node,
                            vm: self,
                            namespace: namespace
                        }, descriptor, {
                            filters: readFilters
                        });
                    directive.unwatch || self.$watch(target, function (value) {
                        value = self.applyFilters(value, readFilters);
                        update.call(that, value);
                    }, typeof data[key] === 'object', options.immediate || (data[key] !== undefined));
                    if (_.isObject(directive) && directive.bind) directive.bind.call(that);
                });

            name === 'repeat' && !isFirst &&
                descriptors.forEach(function (descriptor) {
                    var key = descriptor.target,
                        target = namespace ? ([namespace, key].join('.')) : key,
                        readFilters = self._makeReadFilters(descriptor.filters),
                        repeats = [],
                        tpl = node,
                        ref = document.createComment('q-repeat');
                    node.parentNode.replaceChild(ref, tpl);
                    readFilters.push(function (arr) {
                        if (repeats.length) {
                            repeats.forEach(function (node) {
                                node.parentNode.removeChild(node);
                            });
                            _.cleanData(repeats);
                            repeats.length = 0;
                        }
                        var fragment = document.createDocumentFragment(),
                            itemNode;
                        arr.forEach(function (obj, i) {
                            itemNode = _.clone(tpl);
                            self._templateBind(itemNode, {
                                data: obj,
                                namespace: obj.$namespace(),
                                immediate: true,
                                isTemplate: true
                            });
                            repeats.push(itemNode);
                            fragment.appendChild(itemNode);
                        });
                        ref.parentNode.insertBefore(fragment, ref);
                    });
                    self.$watch(target, function (value) {
                        _.nextTick(function () {
                            self.applyFilters(value, readFilters);
                            self.$emit('repeat-render');
                        });
                    }, false, true);
                });
        });
    }, options.isTemplate, true);
};
