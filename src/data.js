var _ = require('./utils');

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
