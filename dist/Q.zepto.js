/*!
 * Q.js v0.4.6
 * Inspired from vue.js
 * (c) 2015 Daniel Yang
 * Released under the MIT License.
 */

/**
 * Depend on zepto & support mobile browser
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("zepto"));
	else if(typeof define === 'function' && define.amd)
		define(["zepto"], factory);
	else if(typeof exports === 'object')
		exports["Q"] = factory(require("zepto"));
	else
		root["Q"] = factory(root["Zepto"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_4__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__(1),
	    _ = __webpack_require__(3),
	    factory = __webpack_require__(5)

	_.extend(utils, _);
	module.exports = factory(utils);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var noop = function () {},
	    defer = window.requestAnimationFrame ||
	        window.webkitRequestAnimationFrame ||
	        setTimeout,
	    cache = new (__webpack_require__(2))(1000),
	    _qtid = 0,
	    slice = [].slice;

	function walk($el, cb, setting) {
	    var i, j, l, el, atts, res, qtid;
	    for (i = 0; el = $el[i++];) {
	        if (el.nodeType === 1) {
	            if (
	                setting.useCache &&
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
	                if (setting.useCache && !qtid) {
	                    qtid = qtid || ++_qtid;
	                    el.setAttribute('qtid', qtid);
	                    cache.put(qtid, res);
	                }
	            }
	            res.length > 0 &&
	                cb(el, res, setting);
	        }
	        if (el.childNodes.length && !setting.stop) walk(slice.call(el.childNodes, 0), cb, setting);
	        // reset stop
	        setting.stop = false;
	    }
	}

	module.exports = {
	    slice: slice,
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
	                el.setAttribute('class', (cur + cls).trim());
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
	            el.setAttribute('class', cur.trim());
	        }
	    },
	    noexist: function (name) { throw new Error('Filter ' + name + ' hasn\'t implemented.'); },
	    warn: function () {
	        return (window.console && console.error) ? function (msg) {
	                console.error(msg);
	            } : noop;
	    },
	    isObject: function (o) {
	        return typeof o === 'object';
	    },
	    nextTick: function (cb, ctx) {
	        return ctx ?
	            defer(function () { cb.call(ctx) }, 0) :
	            defer(cb, 0);
	    },
	    walk: walk
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * just a copy of: https://github.com/yyx990803/vue/blob/master/src/cache.js
	 *
	 * @param {Number} limit
	 * @constructor
	 */

	function Cache (limit) {
	    this.size = 0;
	    this.limit = limit;
	    this.head = this.tail = undefined;
	    this._keymap = {};
	}

	var p = Cache.prototype;

	/**
	 * Put <value> into the cache associated with <key>.
	 * Returns the entry which was removed to make room for
	 * the new entry. Otherwise undefined is returned.
	 * (i.e. if there was enough room already).
	 *
	 * @param {String} key
	 * @param {*} value
	 * @return {Entry|undefined}
	 */

	p.put = function (key, value) {
	    var entry = {
	        key:key,
	        value:value
	    }
	    this._keymap[key] = entry;
	    if (this.tail) {
	        this.tail.newer = entry;
	        entry.older = this.tail;
	    } else {
	        this.head = entry;
	    }
	    this.tail = entry;
	    if (this.size === this.limit) {
	        return this.shift();
	    } else {
	        this.size++;
	    }
	};

	/**
	 * Purge the least recently used (oldest) entry from the
	 * cache. Returns the removed entry or undefined if the
	 * cache was empty.
	 */

	p.shift = function () {
	    var entry = this.head;
	    if (entry) {
	        this.head = this.head.newer;
	        this.head.older = undefined;
	        entry.newer = entry.older = undefined;
	        this._keymap[entry.key] = undefined;
	    }
	    return entry;
	};

	/**
	 * Get and register recent use of <key>. Returns the value
	 * associated with <key> or undefined if not in cache.
	 *
	 * @param {String} key
	 * @param {Boolean} returnEntry
	 * @return {Entry|*}
	 */

	p.get = function (key, returnEntry) {
	    var entry = this._keymap[key];
	    if (entry === undefined) return;
	    if (entry === this.tail) {
	        return returnEntry ?
	            entry :
	            entry.value;
	    }
	  // HEAD--------------TAIL
	  //   <.older   .newer>
	  //  <--- add direction --
	  //   A  B  C  <D>  E
	    if (entry.newer) {
	        if (entry === this.head) {
	            this.head = entry.newer;
	        }
	        entry.newer.older = entry.older; // C <-- E.
	    }
	    if (entry.older) {
	        entry.older.newer = entry.newer; // C. --> E
	    }
	    entry.newer = undefined; // D --x
	    entry.older = this.tail; // D. --> E
	    if (this.tail) {
	        this.tail.newer = entry; // E. <-- D
	    }
	    this.tail = entry;
	    return returnEntry ?
	        entry :
	        entry.value;
	}

	module.exports = Cache;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(4),
	    _extend = $.extend,
	    _expando = 'QDataUid',
	    _uid = 0,
	    _map = {};

	module.exports = {
	    find: function (selector) {
	        // zepto just use document.querySelectorAll
	        return this.slice.call(document.querySelectorAll(selector), 0);
	    },
	    contains: $.contains,
	    data: function (el, key, value) {
	        var uid = el[_expando] = el[_expando] || ++_uid,
	            data = _map[uid] = _map[uid] || {};
	        // set Data
	        if (value === undefined) return data[key];
	        return (data[key] = value);
	    },
	    cleanData: function (els) {
	        var uid
	        els.forEach(function (el) {
	            var uid = el[_expando];
	            // has data
	            uid && (uid in _map) &&
	                (delete _map[uid]);
	        });
	    },
	    add: $.event.add,
	    remove: $.event.remove,
	    clone: function (ele) {
	        return ele.cloneNode(true);
	    },
	    extend: function (target) {
	        if (arguments.length === 1) return _extend(this, target);
	        return _extend.apply(this, arguments);
	    }
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function (_) {

	    var Data = __webpack_require__(8),
	        events = __webpack_require__(9),
	        MARK = /\{\{(.+?)\}\}/,
	        mergeOptions = __webpack_require__(7).mergeOptions,
	        clas = __webpack_require__(6),
	        _doc = document;

	    function _inDoc(ele) {
	        return _.contains(_doc.documentElement, ele);
	    }

	    function Q(options) {
	        this._init(options);
	    }
	    // exports utils
	    Q._ = _;
	    Q.options = {
	        directives: __webpack_require__(10),
	        filters: {}
	    };
	    Q.get = function (selector) {
	        var ele = _.find(selector)[0];
	        if (ele) {
	            return _.data(ele, 'QI');
	        } else {
	            return new this({ el: selector });
	        }
	    };
	    Q.all = function (options) {
	        var self = this;
	        return _.find(options.el).map(function (ele) {
	            return new self(_.extend(options, { el: ele }));
	        });
	    };
	    _.extend(Q, clas);
	    _.extend(Q.prototype, {
	        _init: function (options) {
	            options = options || {};
	            this.$el = options.el &&
	                    typeof options.el === 'string' ?
	                        _.find(options.el)[0] :
	                        options.el;
	            // element references
	            this.$$ = {};
	            // set parent vm
	            this.$parent = options._parent;
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

	            // components
	            this._children = [];
	            // components references
	            this.$ = {};

	            Data.call(this, options);
	            // this._data = options.data;
	            // initialize data and scope inheritance.
	            this._initScope();
	            // call created hook
	            this._callHook('created');
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
	            if (key === undefined) return this;
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
	            if (value === undefined) return key ? data[key] : data;
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
	         * @param {String} e
	         */
	        $emit: function (e) {
	            var args = _.slice.call(arguments, 1);
	            events.emit.call(this, e, _.slice.call(args, 0));
	            // emit data change
	            if (e.indexOf('data:') === 0) {
	                e = e.substring(5);
	                events.callDataChange.call(this, e, _.slice.call(args, 0));
	                args.unshift(e);
	                events.emit.call(this, 'datachange', args);
	            }
	            return this;
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
	        _templateBind: __webpack_require__(12),

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
	            return names.map(function (args) {
	                // 需要修改args 必须复制
	                args = [].concat(args);
	                var name = args.shift();
	                var reader = (filters[name] ? (filters[name].read || filters[name]) : _.noexist(name));
	                return function (value, oldVal) {
	                    return args ?
	                        reader.apply(self, [value].concat(args.push(oldVal) && args)) :
	                            reader.call(self, value, oldVal);
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

	    return Q;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// Modules map
	var modules = {},
	    mergeOptions = __webpack_require__(7).mergeOptions,
	    listeners = {};

	function _define(name, options) {
	    if (modules[name]) return false;
	    var module = modules[name] = this.extend(options || {});
	    return module;
	}

	function _require(name, callback) {
	    return modules[name] || this;
	}

	function _create(o) {
	    function F() {}
	    F.prototype = o;
	    return new F();
	}

	function _extend(extendOptions) {
	    extendOptions = extendOptions || {};
	    var Super = this,
	        Sub = createClass(extendOptions.name || 'QComponent');
	    Sub.prototype = _create(Super.prototype);
	    Sub.prototype.constructor = Sub;
	    Sub.options = mergeOptions(
	        Super.options,
	        extendOptions
	    );
	    Sub['super'] = Super;
	    Sub.extend = Super.extend;
	    Sub.get = Super.get;
	    Sub.all = Super.all;
	    Sub.require = Super.require;
	    Sub.define = Super.define;
	    return Sub;
	}

	function createClass (name) {
	    return new Function(
	        'return function ' + name +
	        ' (options) { this._init(options) }'
	    )();
	}

	module.exports = {
	    /**
	     * define
	     * define a component
	     * @param {String} name
	     * @param {Object} options
	     */
	    define: _define,
	    /**
	     * require
	     * require(name)
	     * require(names, callback)
	     * require a component
	     * @param {String} name
	     * @param {Array} names
	     * @param {Function} callback
	     */
	    require: _require,
	    /**
	     * extend
	     * extend the class
	     * @param {Object} options
	     */
	    extend: _extend
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(1);

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
	strats.filters =
	strats.methods =
	strats.directives = function (parentVal, childVal) {
	  if (!childVal) return parentVal;
	  if (!parentVal) return childVal;
	  return _.extend({}, parentVal, childVal);
	};

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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(1);

	/**
	 * prefix data
	 */
	function _prefix(up, key, value) {
	    var options = {
	        data: value,
	        up: up,
	        top: up._top,
	        namespace: key + ''
	    };
	    if (typeof value === 'object' && value !== null) {
	        up[key] =   _isArray(value) ?
	            new DataArray(options) :
	                new Data(options);
	    } else {
	        up[key] = value;
	    }
	    if (!(~up._keys.indexOf(key))) up._keys.push(key);
	}

	function _isArray(obj) {
	    return Array.isArray(obj) || obj instanceof DataArray;
	}

	function _getLength(keys) {
	    return keys.filter(function (key) {
	        return typeof key === 'number';
	    }).length;
	}

	/**
	 * Data
	 * @class
	 * @param {Object} options
	 */
	function Data(options) {
	    var data = options.data,
	        keys = Object.keys(options.data || {})
	            .filter(function (key) { return key.indexOf('_') !== 0; })
	            .map(function (num) {
	                return +num + '' === num ? +num : num;
	            }),
	        self = this;

	    _.extend(this, data);

	    // all key need to traverse
	    this._keys = keys;
	    // parent data container
	    this._up = options.up;
	    // the most top parent data container
	    this._top = options.top || this;
	    // the namespace of data
	    this._namespace = options.namespace || '';
	    keys.forEach(function (key) {
	        _prefix(self, key, data[key]);
	    });
	    // if it is a array
	    (Array.isArray(data) || data instanceof DataArray) &&
	        // fix the length
	        (this.length = _getLength(keys));
	}
	_.extend(Data.prototype, {
	    /**
	     * get the namespace
	     */
	    $namespace: function (key) {
	        var keys = [],
	            self = this;
	        for (; self != undefined; self = self._up) {
	            self._namespace &&
	                keys.unshift(self._namespace);
	        }
	        if (key) keys.push(key);
	        return keys.join('.');
	    },
	    /**
	     * get the key of it's parent
	     */
	    $key: function () {
	        var key = this._namespace;
	        return +key + '' === key ? +key : key;
	    },
	    /**
	     * get the parent of the data
	     */
	    $up: function () {
	        return this._up;
	    },
	    /**
	     * set the value of the key
	     */
	    $set: function (key, value) {
	        if (typeof key === 'object') {
	            var self = this;
	            Object.keys(key).forEach(function (k) {
	                self.$set(k, key[k]);
	            });
	        } else {
	            var oldValue = this[key];
	            _prefix(this, key, value);
	            this.$change(this.$namespace(key), this[key], oldValue);
	        }
	        return this;
	    },
	    /**
	     * get the actual value
	     */
	    $get: function () {
	        var res, keys = this._keys, self = this;
	        if (this instanceof Data) {
	            res = {};
	        } else {
	            res = [];
	        }
	        keys.forEach(function (key) {
	            res[key] = self[key].$get ?
	                self[key].$get() :
	                self[key];
	        });
	        return res;
	    },
	    /**
	     * change
	     */
	    $change: function (key, value, oldVal, patch) {
	        this._top.$emit &&
	            this._top.$emit('data:' + key, value, oldVal, patch);
	    }
	});

	function DataArray(options) {
	    Data.call(this, options);
	}
	_.extend(DataArray.prototype, Data.prototype, {
	    /**
	     * push data
	     */
	    push: function (values) {
	        values = _.slice.call(arguments, 0);
	        var args = [];
	        for (var i = 0, l = values.length; i < l; i++) {
	            _prefix(this, this.length, values[i]);
	            this._keys.push(this.length);
	            args.push(this[this.length]);
	            this.length++;
	        }
	        // value, oldValue, patch
	        this.$change(this.$namespace(), this, null, {
	            method: 'push',
	            args: args
	        });

	        return this;
	    },
	    /**
	     * pop data
	     */
	    pop: function () {
	        var res = this[--this.length];
	        delete this[this.length];
	        this._keys.pop();
	        this.$change(this.$namespace(), this);
	        return res;
	    },
	    /**
	     * unshift
	     */
	    unshift: function (value) {
	        this._keys.push(this.length);
	        this.length++;
	        for (var l = this.length; l--;) {
	            this[l] = this[l - 1];
	            // fixed namespace
	            typeof this[l] === 'object' &&
	                (this[l]._namespace = l + '');
	        }
	        _prefix(this, 0, value);
	        this.$change(this.$namespace(), this);
	        return this;
	    },
	    /**
	     * shift
	     */
	    shift: function () {
	        this.length--;
	        var res = this[0];
	        for (var i = 0, l = this.length; i < l; i++) {
	            this[i] = this[i + 1];
	            // fixed namespace
	            typeof this[i] === 'object' &&
	                (this[i]._namespace = i + '');
	        }
	        this._keys.pop();
	        delete this[this.length];
	        this.$change(this.$namespace(), this);
	        return res;
	    },
	    /**
	     * touch
	     */
	    touch: function (key) {
	        this.$change(this.$namespace(key), this);
	    },
	    /**
	     * indexOf
	     */
	    indexOf: function (item) {
	        if (item._up === this) {
	            var i = +item._namespace;
	            if (this[i] === item) return i;
	        } else if (typeof item !== 'object') {
	            for (var i = 0, l = this.length; i < l; i++) {
	                if (this[i] === item) return i;
	            }
	        }
	        return -1;
	    },
	    /**
	     * splice
	     */
	    splice: function (i, l /**, items support later **/) {
	        var patch = {
	            method: 'splice',
	            args: [i, l]
	        };
	        for (var j = 0, k = l + i, z = this.length - l; i < z; i++, j++) {
	            this[i] = this[k + j];
	            typeof this[i] === 'object' &&
	                (this[i]._namespace = i + '');
	        }
	        for (;i < this.length; i++) {
	            this[i] = null;
	            delete this[i];
	        }
	        this.length -= l;
	        this._keys.splice(this.length, l);
	        this.$change(this.$namespace(), this, null, patch);
	    },
	    /**
	     * forEach
	     */
	    forEach: function (foo) {
	        for (var i = 0, l = this.length; i < l; i++) {
	            foo(this[i], i);
	        }
	    },
	    /**
	     * filter
	     */
	    filter: function (foo) {
	        var res = [];
	        this.forEach(function (item, i) {
	            if (foo(item)) res.push(item);
	        });
	        return res;
	    }
	});

	module.exports = Data;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Data = __webpack_require__(8),
	    _ = __webpack_require__(1);


	// TODO: remove for the present
	// function _clearWatch(namespace) {
	//     namespace = namespace + '.';
	//     var key;
	//     for (key in this._watchers) {
	//         if (~key.indexOf(namespace)) {
	//             this._watchers[key].length = 0;
	//         }
	//     }
	// }

	function _emit(key, args, target) {
	    // set the trigger target is pass in or this
	    target = target || this;
	    var cbs = this._events[key];
	    if (cbs) {
	        var i = 0;
	        cbs = cbs.length > 1 ?
	            _.slice.call(cbs, 0) :
	            cbs;
	        for (var l = cbs.length; i < l; i++) {
	            cbs[i].apply(target, args);
	        }
	    }
	    // emit parent
	    if (key.indexOf('data:') && this.$parent) {
	        _emit.call(this.$parent, key, args, target);
	    }
	}

	function _callDataChange(key, args) {
	    var props, nArgs,
	        keys = key.split('.'),
	        self = { _events: this._watchers };

	    _emit.call(self, key, args);
	    for (; keys.length > 0;) {
	        key = keys.join('.');
	        props = key + '**deep**';
	        // remove the old value
	        nArgs = _.slice.call(args, 0, 1);
	        nArgs[0] = this.data(key);
	        _emit.call(self, props, nArgs);
	        keys.pop();
	    }
	    // emit vm is change
	    _emit.call(self, '**deep**', [this]);
	};

	module.exports = {
	    emit: _emit,
	    callDataChange: _callDataChange
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(1),
	    strats = __webpack_require__(7);

	module.exports = {
	    show: function (value) {
	        var el = this.el;
	        if (value) el.style.display = 'block';
	        else el.style.display = 'none';
	    },
	    'class': function (value) {
	        var el = this.el,
	            arg = this.arg;
	        if (arg) {
	            value ?
	                _.addClass(el, arg) :
	                _.removeClass(el, arg);
	        } else {
	            if (this.lastVal) {
	                _.removeClass(el, this.lastVal);
	            }
	            if (value) {
	                _.addClass(el, value);
	                this.lastVal = value;
	            }
	        }
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
	        if (arg === 'style') {
	            if (typeof value === 'object') {
	                for (var k in value) {
	                    if (value.hasOwnProperty(k)) {
	                        el.style[k] = value[k];
	                    }
	                }
	            } else {
	                el.setAttribute(arg, value);
	            }
	        } else {
	            if (arg in el) {
	                el[arg] = value;
	            } else {
	                el.setAttribute(arg, value);
	            }
	        }
	    },
	    text: function (value) {
	        value !== undefined &&
	            (this.el.textContent =
	                value == null ?
	                    '' :
	                    value.toString());
	    },
	    html: function(value) {
	        this.el.innerHTML = value && value.toString() || '';
	    },
	    on: {
	        bind: function () {
	            var self = this,
	                key = this.target || this.exp.match(/^[\w\-]+/)[0],
	                expression = this.exp,
	                filters = this.filters,
	                vm = this.vm,
	                handler = vm.applyFilters(this.vm[key], filters),
	                data = expression && self.data();
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
	                vm = this.vm,
	                data = vm.data(namespace);
	            _.add(el, 'input propertychange change', function (e) {
	                data.$set(key, el.value);
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
	                extend = el.getAttribute('q-extend'),
	                namespace = this.namespace,
	                target = namespace ? ([namespace, key].join('.')) : key,
	                data = vm.data(target),
	                Child = vm.constructor.require(name),
	                mergeTarget = Child.options.data,
	                options,
	                childVm;

	            // merge data
	            mergeTarget &&
	                Object.keys(mergeTarget).forEach(function (key) {
	                    key in data ||
	                        data.$set(key, mergeTarget[key]);
	                });

	            options = {
	                el: el,
	                data: data.$get(),
	                _parent: vm
	            };

	            if (extend && (extend = vm.$options.extend[extend])) {
	                if (extend.data || extend.el || extend._parent) throw new Error('Extend Error');
	                options = strats.mergeOptions(options, extend);
	            }

	            childVm = new Child(options);

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
	            vm.$on('datachange', function (prop, value) {
	                // stop child vm datachange bubble
	                if (this !== vm) return;
	                if (!target || ~prop.indexOf(target)) {
	                    var start = target.length,
	                        childProp;

	                    start && (start += 1);
	                    childProp = prop.substring(start, prop.length);
	                    childVm.$set(childProp, value);
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
	                exist = true,
	                key = this.target,
	                namespace = this.namespace,
	                target = namespace ? ([namespace, key].join('.')) : key,
	                readFilters = this.filters,
	                data = this.data(),
	                vm = this.vm;

	            tpl.removeAttribute('q-if');
	            this.setting.stop = true;

	            vm.$watch(target, function (value, oldVal) {
	                value = vm.applyFilters(value, readFilters, oldVal);
	                if (!hasInit && value === true) {
	                    hasInit = true;
	                    vm._templateBind(tpl, {
	                        data: data,
	                        namespace: namespace,
	                        immediate: true
	                    });
	                }
	                // need to init
	                if (value === exist) return;
	                // bind
	                if (value === true) {
	                    parentNode.replaceChild(tpl, ref);
	                    exist = value;
	                // unbind
	                } else if (value === false) {
	                    parentNode.replaceChild(ref, tpl);
	                    exist = value;
	                }
	            }, false, true);
	        }
	    },
	    repeat: __webpack_require__(11)
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(1);
	    methods = {
	        'default': {
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
	            dp: function (data, patch) {
	                return patch.args;
	            }
	        },
	        splice: {
	            clean: function (parentNode, repeats, value, watchers) {
	                var i = value[0],
	                    l = value[1],
	                    target = value[2].$namespace(),
	                    eles = repeats.splice(i, l);
	                eles.forEach(function (ele) {
	                    parentNode.removeChild(ele);
	                });
	                // just splice one time
	                if (!value.done) {
	                    splice(watchers, target, i, l);
	                    value.done = true;
	                }
	                return true;
	            },
	            dp: function (data, patch) {
	                patch.args.push(data);
	                return patch.args;
	            }
	        }
	    };


	function splice(watchers, target, i, l) {
	    var length = target.length,
	        subKey,
	        cur,
	        index,
	        newKey;
	    Object.keys(watchers).forEach(function (key) {
	        if (~key.indexOf(target)) {
	            subKey = key.substring(length + 1);
	            cur = subKey.split('.');
	            if (cur.length) {
	                index = +cur.shift();
	                if ((index -= l) >= i) {
	                    cur.unshift(index);
	                    cur.unshift(target);
	                    newKey = cur.join('.');
	                    watchers[newKey] = watchers[key];
	                    delete watchers[key];
	                }
	            }
	        }
	    });
	}

	exports.bind = function () {
	    var tpl = this.el,
	        setting = this.setting,
	        parentNode = tpl.parentNode,
	        key, namespace, target, readFilters, repeats, ref, vm;
	    // return
	    if (!parentNode || setting.stop) return;

	    // remove repeat mark
	    tpl.removeAttribute('q-repeat');
	    setting.stop = true;

	    key = this.target;
	    namespace = this.namespace;
	    target = namespace ? ([namespace, key].join('.')) : key;
	    readFilters = this.filters;
	    repeats = [];
	    ref = document.createComment('q-repeat');
	    vm = this.vm;

	    parentNode.replaceChild(ref, tpl);
	    // cache tpl
	    _.walk([tpl], _.noop, { useCache: true });

	    vm.$watch(target, function (value, oldVal, patch) {
	        // if value is undefined just return
	        if (value === undefined) return;
	        value = vm.applyFilters(value, readFilters);
	        var method = (!readFilters.length && patch) ? patch.method : 'default',
	            dp = (methods[method] || {}).dp,
	            clean = (methods[method] || {}).clean,
	            insert = (methods[method] || {}).insert;

	        // if dp exists, proceess data
	        dp && (value = dp(value, patch));

	        if (clean && clean(parentNode, repeats, value, vm._watchers, target) === true) {
	            return;
	        }

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
	    }, false, true);
	}


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var parse = __webpack_require__(13),
	    _ = __webpack_require__(1);

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
	                    }, typeof data[key] === 'object', typeof options.immediate === 'boolean' ? options.immediate : (data[key] !== undefined));
	                    if (_.isObject(directive) && directive.bind) directive.bind.call(that);
	                });
	        });
	    }, {
	        useCache: options.useCache
	    });
	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var cache = new (__webpack_require__(2))(1000);
	/**
	 * click: onclick | filter1 | filter2
	 * click: onclick , keydown: onkeydown
	 * value1 | filter1 | filter2
	 * value - 1 | filter1 | filter2   don't support
	 */
	function parse(str) {
	    var hit = cache.get(str);
	    if (hit) return hit;

	    var arr = [];
	    var words = getWords(str);
	    var exps = splitArrayByItem(words, ',');
	    var keyReg = /^[\w\-]+$/;

	    exps.forEach(function(exp) {
	        var pipes = splitArrayByItem(exp, '|');
	        var targetInfo = pipes[0];
	        var res = {
	            filters: pipes.slice(1)
	        };
	        if (targetInfo[1] === ':') {
	            res.arg = targetInfo[0];
	            targetInfo.splice(0, 2);
	        }
	        if (keyReg.test(targetInfo[0])) {
	            res.target = targetInfo[0];
	        } else {
	            // 'click: select(this)' 词法分析保准不把()分割成单独单词
	            res.exp = targetInfo[0];
	        }
	        arr.push(res);
	    });
	    cache.put(str, arr);
	    return arr;
	}

	/**
	 * 词法分析
	 * @param {string} str
	 * @return {Array<string>} 
	 */
	function getWords(str) {
	    var words = [];
	    var quote = null; // 在引号中 ' or "
	    var quoteEscape = false; // 引号中上一个字符为\转义
	    var w = ''; // pending word
	    var spaces = /[\s]/; // 空格
	    var oneCharWord = /[|,:]/; // 必须单个字符的单词

	    function push() {
	        w && words.push(w);
	        w = '';
	    }

	    for (var i = 0; i < str.length; i++) {
	        var ch = str.charAt(i);
	        if (quote) {
	            if (quoteEscape) {
	                // leave escape
	                quoteEscape = false;
	                w += ch;
	            } else if (ch === '\\') {
	                // enter escape
	                quoteEscape = true;
	            } else if (ch === quote) {
	                // leave quote
	                quote = false;
	                push();
	            } else {
	                w += ch;
	            }
	        } else if (ch === '\'' || ch === '"') {
	            // enter quote
	            push();
	            quote = ch;
	        } else if (spaces.test(ch)) {
	            push();
	        } else if (oneCharWord.test(ch)) {
	            push();
	            words.push(ch);
	        } else {
	            w += ch;
	        }
	    }
	    push();
	    return words;
	}

	/**
	 * 分割数组
	 * @param {Array} arr
	 * @param {Object} item
	 * @return {Array<Array>}
	 */
	function splitArrayByItem(arr, item) {
	    var result = [[]];
	    for (var i in arr) {
	        var curr = arr[i];
	        if (item === curr) {
	            result.push([]);
	        } else {
	            result[result.length - 1].push(curr);
	        }
	    }
	    return result;
	}

	module.exports = parse;


/***/ }
/******/ ])
});
;