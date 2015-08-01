var Data = require('./data'),
    _ = require('./utils');

function emit(key, args, target) {
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
    // prevent data: event and hook: event trigger
    if (key.indexOf('data:') && key.indexOf('hook:') && key.indexOf('deep:') && this.$parent) {
        emit.call(this.$parent, key, args, target);
    }
}

function callChange(key, args) {
    var self = {
        _events: this._watchers
    };
    emit.call(self, key, args);
    emit.call(self, key + '**deep**', args);
}

function callDeep(key, args) {
    var props, nArgs,
        keys = key.split('.'),
        self = { _events: this._watchers };

    for (keys.pop(); keys.length > 0; keys.pop()) {
        key = keys.join('.');
        props = key + '**deep**';
        // remove the old value
        emit.call(self, props, [this.data(key)]);
    }
    // emit vm is change
    emit.call(self, '**deep**', [this]);
}

module.exports = {
    emit: emit,
    callChange: callChange,
    callDeep: callDeep
};
