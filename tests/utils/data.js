var Data = require('../../src/core/data');

describe('Data', function () {
    it('should set and get a data', function () {
        var data = new Data({
            data: {
                msg: 'hello'
            }
        });

        // set & get string
        data.msg.should.equal('hello');
        data.$set('msg', 'hello world');
        data.msg.should.equal('hello world');

        data = new Data({
            data: {
                obj: {
                    msg: 'hello'
                }
            }
        });

        // set & get object
        data.obj.$get().should.eql({
            msg: 'hello'
        });
        data.$set('obj', {
            msg: 'world'
        });
        data.obj.$get().should.eql({
            msg: 'world'
        });
        (data.obj instanceof Data).should.be.true;

        data = new Data({
            data: {
                num: 1
            }
        });

        // set & get number
        data.num.should.equal(1);
        data.$set('num', 2);
        data.num.should.equal(2);

        data = new Data({
            data: {
                bool: false
            }
        });

        // set & get boolean
        data.bool.should.not.be.true;
        data.$set('bool', true);
        data.bool.should.be.true;

    });
})
