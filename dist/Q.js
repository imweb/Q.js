/**
 * Q.js v0.0.0
 * Inspired from vue.js
 * (c) 2015 Daniel Yang
 * Released under the MIT License.
 * from: http://kangax.github.io/compat-table/es5
 * We can find almost all es5 features have been supported after IE9,
 * so we suggest under IE8 just use:
 * https://github.com/es-shims/es5-shim
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define(["jquery"], factory);
	else if(typeof exports === 'object')
		exports["Q"] = factory(require("jquery"));
	else
		root["Q"] = factory(root["jquery"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_4__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(1),
	    Data = __webpack_require__(2),
	    MARK = /\{\{(.+?)\}\}/,
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
	    directives: __webpack_require__(3)
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
	        return new Q(_.extend({ el: ele }, options));
	    });
	};
	_.extend(Q.prototype, {
	    _init: function (options) {
	        options = options || {};
	        this.$el = _.find(options.el)[0];
	        // element references
	        this.$$ = {};
	        // merge options
	        options = this.$options = _.mergeOptions(
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
	        this._data = options.data;
	        // cache the instance
	        _.data(this.$el, 'QI', this);
	        // initialize data and scope inheritance.
	        this._initScope();
	        // call created hook
	        this._callHook('created')
	        // start compilation
	        this.$mount(this.$el);
	    },

	    /**
	     * Set data and Element value
	     *
	     * @param {String} key
	     * @param {Object} obj
	     * @returns {Data}
	     */
	    data: function (key, obj) {
	        var d = new Data(this);
	        return key ? d.find(key, obj) : d;
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
	        immediate && cb(this.data(exp).get());
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
	        if (Array.isArray(args[1])) this._clearWatch(key);
	        _emit.apply(self, args);
	        for (; keys.length > 0;) {
	            key = keys.join('.');
	            args[0] = key + '**deep**';
	            args[1] = this.data(key).get();
	            _emit.apply(self, args);
	            keys.pop();
	        }
	    },
	    /**
	     * Helper to register an event/watch callback.
	     *
	     * @param {Vue} vm
	     * @param {String} action
	     * @param {String} key
	     * @param {*} handler
	     */
	    register: function (vm, action, key, handler) {
	        var type = typeof handler;
	        if (type === 'functioin') {
	            vm[action](key, hander);
	        } else if (type === 'string') {
	            var methods = vm.$options.methods,
	                method = methods && methods[handler];
	            if (method) {
	                vm[action](key, method);
	            } else {
	                _.warn(
	                    'Unknown method: "' + handler + '" when ' +
	                    'registering callback for ' + action +
	                    ': "' + key + '".'
	                );
	            }
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
	        var self = this, directives = self.$options.directives;
	        _walk([el], function (node, arg) {
	            _findQ(node).forEach(function (obj) {
	                var name = obj.name.substring(2),
	                    directive = directives[name],
	                    descriptors = self._parse(obj.value);
	                if (directive) {
	                    descriptors.forEach(function (descriptor) {
	                        var readFilters = self._makeReadFilters(descriptor.filters),
	                            key = descriptor.src;
	                        descriptor.node = node;
	                        self.$watch(key, function (value) {
	                            value = self.applyFilters(value, readFilters);
	                            directive(value, descriptor);
	                        }, typeof self._data[key] === 'object', true);
	                    });
	                }
	                switch (name) {
	                    case 'repeat':
	                        descriptors.forEach(function (descriptor) {
	                            var key = descriptor.src,
	                                readFilters = self._makeReadFilters(descriptor.filters),
	                                repeats = [],
	                                tpl = node, ref = document.createComment('q-repeat');
	                            node.parentNode.replaceChild(ref, tpl);
	                            readFilters.push(function (arr) {
	                                if (repeats.length) {
	                                    repeats.forEach(function (node) {
	                                        node.parentNode.removeChild(node);
	                                    });
	                                    repeats.length = 0;
	                                }
	                                var fragment = _doc.createDocumentFragment(),
	                                    itemNode;
	                                arr.forEach(function (obj, i) {
	                                    itemNode = _.clone(tpl);
	                                    self._buildNode(itemNode, obj, { key: key, namespace: self.data(key, obj).namespace() });
	                                    repeats.push(itemNode);
	                                    fragment.appendChild(itemNode);
	                                });
	                                ref.parentNode.insertBefore(fragment, ref);
	                            });
	                            self.$watch(key, function (value) {
	                                setTimeout(function () {
	                                    self.applyFilters(value, readFilters);
	                                }, 0);
	                            }, false, true);
	                        });
	                        break;
	                    case 'on':
	                        descriptors.forEach(function (descriptor) {
	                            var event = descriptor.event,
	                                key = descriptor.src || descriptor.expression.match(/^[\w\-]+/)[0],
	                                expression = descriptor.expression,
	                                readFilters = self._makeReadFilters(descriptor.filters),
	                                handler = self.applyFilters(self[key], readFilters);
	                            _.add(node, event, function (e) {
	                                if (!handler || typeof handler !== 'function') {
	                                    return _.warn('You need implement the ' + key + ' method.');
	                                }
	                                e.triggerTarget = this;
	                                expression ?
	                                    handler.call(self, data) :
	                                    handler.apply(self, arguments);
	                            });
	                        });
	                        break;
	                }
	            });
	        });
	    },

	    _buildNode: function (node, data, options) {
	        var self = this,
	            key = options.key,
	            index = options.index,
	            namespace = options.namespace + '.',
	            directives = self.$options.directives;
	        _walk([node], function (node, arg) {
	            _findQ(node).forEach(function (obj) {
	                var name = obj.name.substring(2),
	                    directive = directives[name],
	                    descriptors = self._parse(obj.value);
	                if (directive) {
	                    descriptors.forEach(function (descriptor) {
	                        var readFilters = self._makeReadFilters(descriptor.filters),
	                            key = descriptor.src;
	                        descriptor.node = node;
	                        self.$watch(namespace + key, function (value) {
	                            value = self.applyFilters(value, readFilters);
	                            directive(value, descriptor);
	                        }, typeof data[key] === 'object', true);
	                    });
	                }
	                switch (name) {
	                    case 'on':
	                        descriptors.forEach(function (descriptor) {
	                            var event = descriptor.event,
	                                key = descriptor.src || descriptor.expression.match(/^[\w\-]+/)[0],
	                                expression = descriptor.expression,
	                                readFilters = self._makeReadFilters(descriptor.filters),
	                                handler = self.applyFilters(self[key], readFilters);
	                            _.add(node, event, function (e) {
	                                window._node = node;
	                                if (!handler || typeof handler !== 'function')
	                                    return _.warn('You need implement the ' + name + ' method.');
	                                e.triggerTarget = this;
	                                expression ?
	                                    handler.call(self, data) :
	                                    handler.apply(self, arguments);
	                            });
	                        });
	                        break;
	                    case 'model':
	                        descriptors.forEach(function (descriptor) {
	                            var key = descriptor.src;
	                            self.$watch(namespace + key, function (value) {
	                                node.value = value;
	                            }, typeof data[key] === 'object', true);
	                            _.add(node, 'input onpropertychange change', function (e) {
	                                self.data(namespace + key).set(node.value);
	                            });
	                        });
	                        break;
	                }
	            });
	        });
	    },

	    /**
	     * click: onclick | filter1 | filter2
	     * click: onclick , keydown: onkeydown
	     * value1 | filter1 | filter2
	     * value - 1 | filter1 | filter2   don't support
	     */
	    _parse: function (str) {
	        var exps = str.trim().split(/ *\, */),
	            eventReg = /^([\w\-]+)\:/,
	            keyReg = /^[\w\-]+$/,
	            arr = [];
	        exps.forEach(function (exp) {
	            var res = {},
	                match = exp.match(eventReg),
	                filters, src;
	            if (match) {
	                res.event = match[1];
	                exp = exp.substring(match[0].length).trim();
	            }
	            filters = exp.split(/ *\| */);
	            src = filters.shift();
	            if (keyReg.test(src)) {
	                res.src = src;
	            } else {
	                res.expression = src;
	            }
	            res.filters = filters;
	            arr.push(res);
	        });
	        return arr;
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

	    // _makeWriteFilters: function (names, target) {
	    //     if (!names.length) return [];
	    //     var filters = this.$options.filters,
	    //         self = this;
	    //     return names.map(function (name) {
	    //         var args = name.split(' '),
	    //             writer;
	    //         name = args.shift();
	    //         writer = (filters[name] && filters[name].write || _.through);
	    //         return function (value, oldVal) {
	    //             return args ?
	    //                 writer.apply(self, [value, oldVal].concat(args)) :
	    //                 writer.call(self, value, oldVal);
	    //         };
	    //     });
	    // },

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

	module.exports = Q;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(4),
	    mergeOptions = __webpack_require__(5).mergeOptions,
	    noop = function () {};

	module.exports = {
	    find: $.find,
	    contains: $.contains,
	    data: $.data,
	    add: $.event.add,
	    remove: $.event.remove,
	    clone: $.clone,
	    extend: $.extend,
	    slice: [].slice,
	    mergeOptions: mergeOptions,
	    noop: noop,
	    /**
	     * Add class with compatibility for IE & SVG
	     *
	     * @param {Element} el
	     * @param {Strong} cls
	     */
	    addClass: function (el, cls) {
	        if (el.classList) {
	            el.classList.add(cls);
	        } else {
	            var cur = ' ' + (el.getAttribute('class') || '') + ' ';
	            if (cur.indexOf(' ' + cls + ' ') < 0) {
	                el.setAttribute('class', trim((cur + cls)));
	            }
	        }
	    },
	    /**
	     * Remove class with compatibility for IE & SVG
	     *
	     * @param {Element} el
	     * @param {Strong} cls
	     */
	    removeClass: function (el, cls) {
	        if (el.classList) {
	            el.classList.remove(cls);
	        } else {
	            var cur = ' ' + (el.getAttribute('class') || '') + ' ',
	                tar = ' ' + cls + ' ';
	            while (cur.indexOf(tar) >= 0) {
	                cur = cur.replace(tar, ' ');
	            }
	            el.setAttribute('class', trim(cur));
	        }
	    },
	    through: function (s) { return s; },
	    warn: function () {
	        return (window.console && console.error) ? function (msg) {
	                console.error(msg);
	            } : noop;
	    }
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(1);

	/**
	 * Data
	 * @class
	 * @param {VM} vm
	 */
	function Data(vm) {
	    this._namespace = '';
	    this.data = vm._data;
	    this.vm = vm;
	}
	_.extend(Data.prototype, {
	    /**
	     * namespace
	     * get or set the namespace
	     * @param {String} key
	     * @returns {String}
	     */
	    namespace: function (key) {
	        if (key === undefined) return this._namespace.substring(1);
	        this._namespace += ('.' + key);
	    },
	    /**
	     * set or get data
	     */
	    _value: function (key, value, data) {
	        // need to fix key
	        var i = 0, l, data = data || this.data;
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
	        data[key] = value;
	    },
	    /**
	     * find
	     * walk to the namespace the user want to
	     * @param {String} key
	     * @param {Object} obj
	     * @example:
	     *      find(key)
	     *      find(key, obj)
	     *      find(obj)
	     * @returns {Data}
	     */
	    find: function (key, obj) {
	        var i;
	        if (typeof key !== 'Object') {
	            this.namespace(key);
	            this.data = this._value(key);
	        } else {
	            obj = key;
	            key = null;
	        }
	        // need to find obj
	        if (obj) {
	            if (typeof this.data === 'object') {
	                if (Array.isArray(this.data)) {
	                    i = this.data.indexOf(obj);
	                    if (~i) {
	                        this.namespace(i);
	                        this.data = this.data[i];
	                    }
	                } else {
	                    for (i in this.data) {
	                        if (this.data[i] === obj) {
	                            this.namespace(i);
	                            this.data = this.data[i];
	                            break;
	                        }
	                    }
	                }
	            } else {
	                _warn(this.namespace() + ' don\'t have ' + obj);
	            }
	        }
	        return this;
	    },
	    /**
	     * get
	     * get the value of the key
	     * @param {String} key
	     */
	    get: function (key) {
	        return key ? this.data[key] : this.data;
	    },
	    /**
	     * set
	     * set the value of the key
	     * @param {String} key
	     * @param {*} value
	     * @example
	     *      set(value)
	     *      set(key, value)
	     */
	    set: function (key, value) {
	        if (value === undefined) {
	            value = key;
	            this._value(this.namespace(), value, this.vm._data);
	        } else {
	            this.data[key] = value;
	            this.namespace(key);
	        }
	        this.vm.$emit('data:' + this.namespace(), value);
	        return this;
	    },
	    /**
	     * touch
	     * just touch it, and make it just like we have modified
	     */
	    touch: function () {
	        this.vm.$emit('data:' + this.namespace(), this.get());
	        return this;
	    }
	});

	module.exports = Data;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(1);

	module.exports = {
	    show: function (value, options) {
	        var node = options.node;
	        if (value) node.style.display = 'block';
	        else node.style.display = 'none';
	    },
	    'class': function (value, options) {
	        var node = options.node,
	            event = options.event;
	        value ?
	            _.addClass(node, event) :
	            _.removeClass(node, event);
	    },
	    value: function (value, options) {
	        var node = options.node;
	        if (node.type === 'checkbox') {
	            node.checked = value;
	        } else {
	            node.value = value;
	        }
	    },
	    text: function (value, options) {
	        options.node.innerText = value;
	    }
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var extend = __webpack_require__(4).extend;

	var strats = {};
	strats.created =
	strats.ready =
	strats.attached =
	strats.detached =
	strats.compiled =
	strats.beforeDestroy =
	strats.destroyed =
	strats.paramAttributes = function (parentVal, childVal) {
	    return childVal ?
	        parentVal ?
	            parentVal.concat(childVal) :
	                Array.isArray(childVal) ?
	                    childVal :
	                        [childVal] :
	        parentVal;
	};
	strats.methods =
	strats.directives = function (parentVal, childVal) {
	  if (!childVal) return parentVal;
	  if (!parentVal) return childVal;
	  return extend({}, parentVal, childVal);
	}

	var defaultStrat = function (parentVal, childVal) {
	    return childVal === undefined ?
	        parentVal :
	        childVal;
	};

	/**
	 * Option overwriting strategies are functions that handle
	 * how to merge a parent option value and a child option
	 * value into the final value.
	 *
	 * All strategy functions follow the same signature:
	 *
	 * @param {*} parentVal
	 * @param {*} childVal
	 * @param {Vue} [vm]
	 */
	function mergeOptions(parent, child, vm) {
	    var options = {}, key;
	    for (key in parent) {
	        merge(key);
	    }
	    for (key in child) {
	        if (!(parent.hasOwnProperty(key))) {
	            merge(key);
	        }
	    }
	    function merge(key) {
	        var strat = strats[key] || defaultStrat;
	        options[key] = strat(parent[key], child[key], vm, key);
	    }
	    return options;
	}

	module.exports = {
	    strats: strats,
	    mergeOptions: mergeOptions
	}


/***/ }
/******/ ])
});
