var _ = require('./utils');

/**
 * prefix data
 */
function _prefix(up, key, value) {
    if (+key + '' === key) key = +key;
    up[key] = typeof value === 'object' ? new Data({
        data: value,
        up: up,
        top: up._top,
        namespace: [up._namespace, key].join('.')
    }) : value;
}

/**
 * Data
 * @class
 * @param {Object} options
 */
function Data(options) {
    var data = options.data,
        keys = Object.keys(options.data)
            .filter(function (key) { return key.indexOf('_') !== 0; }),
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
    Array.isArray(data) ?
        // fix the length
        (this.length = keys.length) :
        // if it is a Data Object
        data instanceof Data && Data.length !== undefined &&
            // the length should be keys.length - 1
            (this.length = keys.length - 1);
}
_.extend(Data.prototype, {
    /**
     * get the namespace
     */
    $namespace: function (key) {
        return (
            key !== undefined ?
                [this._namespace, key].join('.') :
                this._namespace
        ).substring(1);
    },
    /**
     * set the value of the key
     */
    $set: function (key, value) {
        _prefix(this, key, value);
        this._top.$emit('data:' + this.$namespace(key), value);
        return this;
    },
    /**
     * push data
     */
    $push: function (value) {
        if (!this.length) return _.warn(this + ' is not a array');
        _prefix(this, this.length, value);
        this.length++;
        this._top.$emit('data:' + this.$namespace(), this);
        return this;
    },
    /**
     * pop data
     */
    $pop: function () {
        if (!this.length) return _.warn(this + ' is not a array');
        var res = this[--this.length];
        this[this.length] = null;
        delete this[this.length];
        this._top.$emit('data:' + this.$namespace(), this);
        return res;
    },
    /**
     * unshift
     */
    $unshift: function (value) {
        if (!this.length) return _.warn(this + ' is not a array');
        this.length++;
        for (var l = this.length; l--;) {
            this[l] = this[l - 1];
        }
        _prefix(this, 0, value);
        this._top.$emit('data:' + this.$namespace(), this);
        return this;
    },
    /**
     * shift
     */
    $shift: function () {
        if (!this.length) return _.warn(this + ' is not a array');
        this.length--;
        var res = this[0];
        for (var i = 0, l = this.length; i < l; i++) {
            this[i] = this[i + 1];
        }
        this._top.$emit('data:' + this.$namespace(), this);
        return res;
    },
    /**
     * touch
     */
    $touch: function (key) {
        this._top.$emit('data:' + this.$namespace(key), this);
    }
});

module.exports = Data;
