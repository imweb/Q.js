var Data = require('./data'),
    _ = require('./utils');

function _clearWatch(namespace) {
    namespace = namespace + '.';
    var key;
    for (key in this._watchers) {
        if (~key.indexOf(namespace)) {
            this._watchers[key].length = 0;
        }
    }
}

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
    if (key.indexOf('data:') !== 0 && this.$parent) {
        _emit.call(this.$parent, key, args, target);
    }
}

function _callDataChange(key, args) {
    var props, nArgs,
        keys = key.split('.'),
        self = { _events: this._watchers };
    // TODO It must use a better way to clear all watch
    // if (args[1] instanceof Data && 'length' in args[1]) _clearWatch(key);
    _emit.call(self, key, args);
    for (; keys.length > 0;) {
        key = keys.join('.');
        props = key + '**deep**';
        nArgs = _.slice.call(args, 0);
        nArgs[0] = this.data(key);
        _emit.call(self, props, nArgs);
        keys.pop();
    }
    // emit vm is change
    _emit.call(self, '**deep**', [this]);
};

module.exports = {
    _clearWatch: _clearWatch,
    _emit: _emit,
    _callDataChange: _callDataChange
};
