var events = require('../../src/core/events');

function MockThis(opts) {
    this._events = opts.events || {};
    this._watchers = opts.watchers || {};
    this.lists = opts.lists || [];
}
MockThis.prototype.data = function (key) {
    if (key === 'lists') return this.lists;
};

describe('events', function () {
    it('should emit the event', function (done) {
        var mock = new MockThis({
            events: {
                change: [function (arg1, arg2, arg3, arg4) {
                    arg1.should.equal('hello');
                    arg2.should.equal(1);
                    arg3.should.eql([2, 3]);
                    arg4.should.eql({ v: 'nihao' });
                    setTimeout(function () {
                        done();
                    }, 0);
                }]
            }
        });

        var args = ['hello', 1, [2, 3], { v: 'nihao' }];
        events._emit.call(mock, 'change', args);
        // it should not be polluted
        args[0].should.equal('hello');
        args[1].should.equal(1);
        args[2].should.eql([2, 3]);
        args[3].should.eql({ v: 'nihao' });
    });

    it('should able set the target when emit', function (done) {
        var mock = new MockThis({
            events: {
                change: [function () {
                    this.should.equal(target);
                    done();
                }]
            }
        });

        var target = {};

        events._emit.call(mock, 'change', [], target);
    });

    it('should able call the data change', function (done) {
        var mock = new MockThis({
            watchers: {
                'msg': [function (val, oldVal) {
                    val.should.equal('newVal');
                    oldVal.should.equal('oldVal');
                    done();
                }]
            }
        });

        events._callDataChange.call(mock, 'msg', ['newVal', 'oldVal']);
    });

    it('should able call the data change deep', function (done) {
        var mock = new MockThis({
            watchers: {
                'lists**deep**': [function (val, oldVal) {
                    val.should.eql([2, 2]);
                    (oldVal === undefined).should.be.true;
                    done();
                }],
                'lists.0': [function (val, oldVal) {
                    val.should.equal(1);
                    oldVal.should.equal(2);
                }]
            },
            lists: [1, 2]
        });

        // set lists.0
        mock.lists[0] = 2;
        // call lists.0 change
        events._callDataChange.call(mock, 'lists.0', [1, 2]);
    });
});
