var _ = require('./utils');

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
