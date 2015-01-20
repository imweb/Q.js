var _ = require('./utils'),
    Data = require('./data'),
    parse = require('./parse'),
    MARK = /\{\{(.+?)\}\}/,
    mergeOptions = require('./strats').mergeOptions,
    _doc = document;


function _checkQ(el) {
    var atts = el.attributes, i = 0 , l = atts.length;
    for (; i < l; i++) {
        if (atts[i].name.indexOf('q-') === 0) return true;
    }
    return false;
}

function _checkRepeat(el) {
    return el.hasAttribute('q-repeat');
}

function _findQ(el) {
    var atts = el.attributes, i = 0 , l = atts.length, res = [];
    for (; i < l; i++) {
        if (atts[i].name.indexOf('q-') === 0) {
            res.push({
                name: atts[i].name,
                value: atts[i].value
            });
        }
    }
    return res;
}

function _walk($el, cb, ingoreRepeat) {
    var arg;
    for (var el, i = 0; el = $el[i++];) {
        if (el.nodeType === 1 && _checkQ(el)) cb(el);
        if (el.childNodes.length && ingoreRepeat ? !_checkRepeat(el) : true) _walk(el.childNodes, cb);
    }
}

function _inDoc(ele) {
    return _.contains(_doc.documentElement, ele);
}

function Q(options) {
    this._init(options);
}
Q.options = {
    directives: require('./directives')
};
Q.get = function (selector) {
    var ele = _.find(selector)[0];
    if (ele) {
        return _.data(ele, 'QI');
    } else {
        return null;
    }
};
Q.all = function (options) {
    return _.find(options.el).map(function (ele) {
        return new Q(_.extend(options, { el: ele }));
    });
};
_.extend(Q.prototype, {
    _init: function (options) {
        options = options || {};
        this.$el = options.el &&
                typeof options.el === 'string' ?
                    _.find(options.el)[0] :
                    options.el;
        // element references
        this.$$ = {};
        // merge options
        options = this.$options = mergeOptions(
            this.constructor.options,
            options,
            this
        );
        // lifecycle state
        this._isCompiled = false;
        this._isAttached = false;
        this._isReady = false;
        // events bookkeeping
        this._events = {};
        this._watchers = {};
        Data.call(this, options);
        // this._data = options.data;
        // initialize data and scope inheritance.
        this._initScope();
        // call created hook
        this._callHook('created')
        // start compilation
        if (this.$el) {
            // cache the instance
            _.data(this.$el, 'QI', this);
            this.$mount(this.$el);
        }
    },

    /**
     * Set data and Element value
     *
     * @param {String} key
     * @param {*} value
     * @returns {Data}
     */
    data: function (key, value) {
        var i = 0, l, data = this;
        if (~key.indexOf('.')) {
            var keys = key.split('.');
            for (l = keys.length; i < l - 1; i++) {
                key = keys[i];
                // key is number
                if (+key + '' === key) key = +key;
                data = data[key];
            }
        }
        l && (key = keys[i]);
        if (value === undefined) return data[key];
        data.$set(key, value);
    },
    /**
     * Listen on the given `event` with `fn`.
     *
     * @param {String} event
     * @param {Function} fn
     */
    $on: function (event, fn) {
        (this._events[event] || (this._events[event] = []))
            .push(fn);
        return this;
    },
    /**
     * Adds an `event` listener that will be invoked a single
     * time then automatically removed.
     *
     * @param {String} event
     * @param {Function} fn
     */
    $once: function (event, fn) {
        var self = this;
        function on() {
            self.$off(event, on);
            fn.apply(this, arguments);
        }
        on.fn = fn;
        this.$on(event, on);
        return this;
    },

    /**
     * Remove the given callback for `event` or all
     * registered callbacks.
     *
     * @param {String} event
     * @param {Function} fn
     */

    $off: function (event, fn) {
        var cbs, cb, i;
        // all event
        if (!arguments.length) {
            this._events = {};
            return this;
        }
        // specific event
        cbs = this._events[event];
        if (!cbs) {
            return this;
        }
        if (arguments.length === 1) {
            this._events[event] = null;
            return this;
        }
        // specific handler
        i = cbs.length;
        while (i--) {
            cb = cbs[i];
            if (cb === fn || cb.fn === fn) {
                cbs.splice(i, 1);
                break;
            }
        }
        return this;
    },
    /**
     * Watch an expression, trigger callback when its
     * value changes.
     *
     * @param {String} exp
     * @param {Function} cb
     * @param {Boolean} [deep]
     * @param {Boolean} [immediate]
     * @return {Function} - unwatchFn
     */
    $watch: function (exp, cb, deep, immediate) {
        var key = deep ? exp + '**deep**' : exp;
        (this._watchers[key] || (this._watchers[key] = []))
            .push(cb);
        immediate && cb(this.data(exp));
        return this;
    },
    /**
     * Trigger an event on self.
     *
     * @param {String} event
     */
    $emit: function (event) {
        this._emit.apply(this, arguments);
        // emit data change
        if (event.indexOf('data:') === 0) {
            var args = _.slice.call(arguments, 1);
            args.unshift(event.substring(5));
            this._callDataChange.apply(this, args);
        }
        return this;
    },

    _emit: function (key) {
        var cbs = this._events[key];
        if (cbs) {
            var i = arguments.length - 1,
                args = new Array(i);
            while (i--) {
                args[i] = arguments[i + 1];
            }
            i = 0
            cbs = cbs.length > 1 ?
                _.slice.call(cbs, 0) :
                cbs;
            for (var l = cbs.length; i < l; i++) {
                cbs[i].apply(this, args);
            }
        }
    },

    _clearWatch: function (namespace) {
        namespace = namespace + '.';
        var key;
        for (key in this._watchers) {
            if (~key.indexOf(namespace)) {
                this._watchers[key].length = 0;
            }
        }
    },

    _callDataChange: function (key) {
        var keys = key.split('.'),
            self = { _events: this._watchers },
            args = _.slice.call(arguments, 1),
            _emit = this._emit, key;
        args.unshift(key);
        // TODO It must use a better way
        if (args[1] instanceof Data && 'length' in args[1]) this._clearWatch(key);
        _emit.apply(self, args);
        for (; keys.length > 0;) {
            key = keys.join('.');
            args[0] = key + '**deep**';
            args[1] = this.data(key);
            _emit.apply(self, args);
            keys.pop();
        }
    },
    /**
     * Setup the scope of an instance, which contains:
     * - observed data
     * - computed properties
     * - user methods
     * - meta properties
     */
    _initScope: function () {
        this._initMethods();
    },

    /**
     * Setup instance methods. Methods must be bound to the
     * instance since they might be called by children
     * inheriting them.
     */
    _initMethods: function () {
        var methods = this.$options.methods, key;
        if (methods) {
            for (key in methods) {
                this[key] = methods[key].bind(this);
            }
        }
    },

    /**
     * Set instance target element and kick off the compilation
     * process. The passed in `el` can be a template string, an
     * existing Element, or a DocumentFragment (for block
     * instances).
     *
     * @param {String|Element|DocumentFragment} el
     * @public
     */
    $mount: function (el) {
        if (this._isCompiled) {
            return _.warn('$mount() should be called only once');
        }
        if (typeof el === 'string') {
            // TODO for template
        }
        this._compile(el);
        this._isCompiled = true;
        this._callHook('compiled');
        if (_inDoc(this.$el)) {
            this._callHook('attached');
            this._ready();
        } else {
            this.$once('hook:attached', this._ready);
        }
    },

    /**
     * ready
     */
    _ready: function () {
        this._isAttached = true;
        this._isReady = true;
        this._callHook('ready');
    },
    /**
     * Transclude, compile and link element.
     *
     * If a pre-compiled linker is available, that means the
     * passed in element will be pre-transcluded and compiled
     * as well - all we need to do is to call the linker.
     *
     * Otherwise we need to call transclude/compile/link here.
     *
     * @param {Element} el
     * @return {Element}
     */
    _compile: function (el) {
        this.transclue(el, this.$options);
    },
    /**
     * Process an element or a DocumentFragment based on a
     * instance option object. This allows us to transclude
     * a template node/fragment before the instance is created,
     * so the processed fragment can then be cloned and reused
     * in v-repeat.
     *
     * @param {Element} el
     * @param {Object} options
     * @return {Element|DocumentFragment}
     */
    transclue: function (el, options) {
        // static template bind
        if (_.find('.q-mark', el).length) {
            this._renderedBind(el, options);
        } else {
            this._templateBind(el, options);
        }
    },

    /**
     * bind rendered template
     */
    _templateBind: function (el, options) {
        options = options || {};
        var self = this,
            directives = self.$options.directives,
            index = options.index,
            data = options.data || self,
            namespace = options.namespace;

        _walk([el], function (node, arg) {
            _findQ(node).forEach(function (obj) {
                var name = obj.name.substring(2),
                    directive = directives[name],
                    descriptors = parse(obj.value);
                if (directive) {
                    descriptors.forEach(function (descriptor) {
                        var readFilters = self._makeReadFilters(descriptor.filters),
                            key = descriptor.target,
                            target = namespace ? [namespace, key].join('.') : key,
                            update = directive.update || directive,
                            that = _.extend({
                                el: node,
                                vm: self,
                                namespace, namespace
                            }, descriptor, {
                                filters: readFilters
                            });
                        directive.unwatch || self.$watch(target, function (value) {
                            value = self.applyFilters(value, readFilters);
                            update.call(that, value);
                        }, typeof data[key] === 'object', options.immediate || data[key] !== undefined);
                        if (_.isObject(directive) && directive.bind) directive.bind.call(that);
                    });
                }

                name === 'repeat' &&
                    descriptors.forEach(function (descriptor) {
                        var key = descriptor.target,
                            readFilters = self._makeReadFilters(descriptor.filters),
                            repeats = [],
                            tpl = node, ref = document.createComment('q-repeat');
                        node.parentNode.replaceChild(ref, tpl);
                        readFilters.push(function (arr) {
                            if (repeats.length) {
                                repeats.forEach(function (node) {
                                    node.parentNode.removeChild(node);
                                });
                                _.cleanData(repeats);
                                repeats.length = 0;
                            }
                            var fragment = _doc.createDocumentFragment(),
                                itemNode;
                            arr.forEach(function (obj, i) {
                                itemNode = _.clone(tpl);
                                self._templateBind(itemNode, {
                                    data: obj,
                                    namespace: obj.$namespace(),
                                    immediate: true
                                });
                                repeats.push(itemNode);
                                fragment.appendChild(itemNode);
                            });
                            ref.parentNode.insertBefore(fragment, ref);
                        });
                        self.$watch(key, function (value) {
                            _.nextTick(function () {
                                self.applyFilters(value, readFilters);
                                self.$emit('repeat-render');
                            });
                        }, false, true);
                    });
        });
    },

    /**
     * bind rendered template
     */
    _renderedBind: function (el, options) {
        var self = this;
    },

    /**
     * Trigger all handlers for a hook
     *
     * @param {String} hook
     */
    _callHook: function (hook) {
        var handlers = this.$options[hook];
        if (handlers) {
            for (var i = 0, j = handlers.length; i < j; i++) {
                handlers[i].call(this);
            }
        }
        this.$emit('hook:' + hook);
    },

    _makeReadFilters: function (names) {
        if (!names.length) return [];
        var filters = this.$options.filters,
            self = this;
        return names.map(function (name) {
            var args = name.split(' '),
                reader;
            name = args.shift();
            reader = (filters[name] ? (filters[name].read || filters[name]) : _.through);
            return function (value) {
                return args ?
                    reader.apply(self, [value].concat(args)) :
                        reader.call(self, value);
            };
        });
    },

    /**
     * Apply filters to a value
     *
     * @param {*} value
     * @param {Array} filters
     * @param {*} oldVal
     * @return {*}
     */
    applyFilters: function (value, filters, oldVal) {
        if (!filters || !filters.length) {
            return value;
        }
        for (var i = 0, l = filters.length; i < l; i++) {
            value = filters[i].call(this, value, oldVal);
        }
        return value;
    }
});

_.extend(Q.prototype, Data.prototype);

module.exports = Q;
