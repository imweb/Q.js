var Data = require('../../src/core/data');

describe('Data & DataArray', function () {
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

    it('should chainability set data', function () {
        var data = new Data({
            msg: 'hello',
            name: 'Donald'
        });

        data.$set('msg', 'nihao')
            .$set('name', 'Daniel');

        data.msg.should.equal('nihao');
        data.name.should.equal('Daniel');
    });

    it('should able to set a data using object', function () {
        var data = new Data({
            data: {
                msg: 'hello',
                firstName: 'Donald',
                lastName: 'Yang'
            }
        });

        data.$set({
            msg: 'nihao',
            firstName: 'Daniel'
        });

        data.msg.should.equal('nihao');
        data.firstName.should.equal('Daniel');
        data.lastName.should.equal('Yang');
    });

    it('should able to get the namespace of a data', function () {
        var data = new Data({
            data: {
                arr: [{
                    v: 1
                }, {
                    v: 2
                }, {
                    v: 3
                }],
                obj: {
                    msg: 'hello'
                }
            }
        });

        data.$namespace().should.equal('');
        data.obj.$namespace('obj');
        data.arr.$namespace('arr');
        data.arr[0].$namespace('arr.0');
        data.arr[1].$namespace('arr.1');
        data.arr[2].$namespace('arr.2');
    });

    it('should able to get the key of a data', function () {
        var data = new Data({
            data: {
                arr: [{
                    v: 1
                }, {
                    v: 2
                }, {
                    v: 3
                }],
                obj: {
                    msg: 'hello'
                }
            }
        });

        data.$key().should.equal('');
        data.arr.$key().should.equal('arr');
        data.obj.$key().should.equal('obj');
        data.arr[0].$key().should.equal(0);
        data.arr[1].$key().should.equal(1);
        data.arr[2].$key().should.equal(2);
    });

    it('should able to get the parent of a data', function () {
        var data = new Data({
            data: {
                arr: [{
                    v: 1
                }, {
                    v: 2
                }, {
                    v: 3
                }],
                obj: {
                    msg: 'hello'
                }
            }
        });

        data.arr.$up().should.equal(data);
        data.obj.$up().should.equal(data);
        data.arr[0].$up().should.equal(data.arr);
        data.arr[1].$up().should.equal(data.arr);
        data.arr[2].$up().should.equal(data.arr);
        data.arr[0].$up().$up().should.equal(data);
    });

    it('should able create a array', function () {
        var arr = (new Data({
            data: {
                arr: [0, 1, 2, 3]
            }
        })).arr;

        for (var i = 0, l = arr.length; i < l; i++) {
            arr[i].should.equal(i);
        }
        arr.$get().should.eql([0, 1, 2, 3]);
    });

    it('should able create a array with properties', function () {
        var orginArr = [0, 1, 2, 3];
        orginArr.msg = 'hello';
        var arr = (new Data({
            data: {
                arr: orginArr
            }
        })).arr;

        arr.length.should.equal(4);
        for (var i = 0, l = arr.length; i < l; i++) {
            arr[i].should.equal(i);
        }
        arr.msg.should.equal('hello');
        arr.$get().should.eql(orginArr);
    });

    it('should able to push a number to a array', function () {
        var arr = (new Data({
            data: {
                arr: [0, 1, 2, 3]
            }
        })).arr;

        arr.push(4);

        arr.length.should.equal(5);
        for (var i = 0, l = 5; i < l; i++) {
            arr[i].should.equal(i);
        }
        arr.$get().should.eql([0, 1, 2, 3, 4]);
    });

    it('should able to push obj to a array', function () {
        // object in array
        var arr = (new Data({
            data: {
                arr: [{
                    v: 0
                }, {
                    v: 1
                }, {
                    v: 2
                }]
            }
        })).arr;

        arr.push({
            v: 3
        });

        arr.length.should.equal(4);
        for (var i = 0, l = 4; i < l; i++) {
            arr[i].v.should.equal(i);
            arr[i].$key().should.equal(i);
        }

        arr.$get().should.eql([
            {
                v: 0
            }, {
                v: 1
            }, {
                v: 2
            }, {
                v: 3
            }
        ]);
    });

    it('should able to pop a number from a array', function () {
        var arr = (new Data({
            data: {
                arr: [0, 1, 2, 3]
            }
        })).arr;

        arr.pop().should.equal(3);

        arr.length.should.equal(3);
        for (var i = 0, l = 3; i < l; i++) {
            arr[i].should.equal(i);
        }

        arr.$get().should.eql([0, 1, 2]);
    });

    it('should able to pop a obj from a array', function () {
        var arr = (new Data({
            data: {
                arr: [{
                    v: 0
                }, {
                    v: 1
                }, {
                    v: 2
                }]
            }
        })).arr;

        arr.pop().v.should.equal(2);

        arr.length.should.equal(2);
        for (var i = 0, l = arr.length; i < l; i++) {
            arr[i].v.should.equal(i);
            arr[i].$key().should.equal(i);
        }

        arr.$get().should.eql([{
            v: 0
        }, {
            v: 1
        }]);
    });

    it('should able to unshift a number to a array', function () {
        var arr = (new Data({
            data: {
                arr: [1, 2, 3, 4]
            }
        })).arr;

        arr.unshift(0);

        arr.length.should.equal(5);
        for (var i = 0, l = arr.length; i < l; i++) {
            arr[i].should.equal(i);
        }

        arr.$get().should.eql([0, 1, 2, 3, 4]);

    });

    it('should able to unshift a object to a array', function () {
        var arr = (new Data({
            data: {
                arr: [{
                    v: 1
                }, {
                    v: 2
                }]
            }
        })).arr;

        arr.unshift({
            v: 0
        });

        arr.length.should.equal(3);
        for (var i = 0, l = arr.length; i < l; i++) {
            arr[i].v.should.equal(i);
            arr[i].$key().should.equal(i);
        }

        arr.$get().should.eql([{
            v: 0
        }, {
            v: 1
        }, {
            v: 2
        }]);
    });

    it('should able to shift a number from array', function () {
        var arr = (new Data({
            data: {
                arr: [-1, 0, 1, 2]
            }
        })).arr;

        arr.shift().should.equal(-1);
        arr.length.should.equal(3);

        for (var i = 0, l = arr.length; i < l; i++) {
            arr[i].should.equal(i);
        }

        arr.$get().should.eql([0, 1, 2]);
    });

    it('should able to shift a object from array', function () {
        var arr = (new Data({
            data: {
                arr: [{
                    v: -1
                }, {
                    v: 0
                }, {
                    v: 1
                }]
            }
        })).arr;

        arr.shift().$get().should.eql({ v: -1 });
        arr.length.should.equal(2);

        for (var i = 0, l = arr.length; i < l; i++) {
            arr[i].v.should.equal(i);
            arr[i].$key().should.equal(i);
        }

        arr.$get().should.eql([{
            v: 0
        }, {
            v: 1
        }]);
    });

    it('should find a number index of a array', function () {
        var arr = (new Data({
            data: {
                arr: [0, 1, 2, 3]
            }
        })).arr;

        for (var i = 0, l = arr.length; i < l; i++) {
            arr.indexOf(arr[i]).should.equal(i);
        }
    });

    it('should find a object index of a array', function () {
        var arr = (new Data({
            data: {
                arr: [{
                    v: 0
                }, {
                    v: 1
                }, {
                    v: 2
                }]
            }
        })).arr;

        for (var i = 0, l = arr.length; i < l; i++) {
            arr.indexOf(arr[i]).should.equal(i);
        }
    });

    it('should able to use forEach for a number array', function () {
        var arr = (new Data({
            data: {
                arr: [0, 1, 2, 3]
            }
        })).arr;

        arr.forEach(function (item, i) {
            item.should.equal(i);
        });
    });

    it('should able to use forEach for a object array', function () {
        var arr = (new Data({
            data: {
                arr: [{
                    v: 0
                }, {
                    v: 1
                }, {
                    v: 2
                }]
            }
        })).arr;

        arr.forEach(function (item, i) {
            item.v.should.equal(i);
            item.$key().should.equal(i);
        });
    });

    it('should able to use splice for a number array', function () {
        var arr = (new Data({
            data: {
                arr: [0, 5, 6, 1, 2, 3]
            }
        })).arr;

        arr.splice(1, 2);

        arr.length.should.equal(4);
        for (var i = 0, l = arr.length; i < l; i++) {
            arr[i].should.equal(i);
        }

        arr.$get().should.eql([0, 1, 2, 3])
    });

    it('should able to use splice for a object array', function () {
        var arr = (new Data({
            data: {
                arr: [{
                    v: 0
                }, {
                    v: 8
                }, {
                    v: 1
                }, {
                    v: 2
                }]
            }
        })).arr;

        arr.splice(1, 1);

        arr.length.should.equal(3);
        for (var i = 0, l = arr.length; i < l; i++) {
            arr[i].v.should.equal(i);
            arr[i].$key().should.equal(i);
        }

        arr.$get().should.eql([{
            v: 0
        }, {
            v: 1
        }, {
            v: 2
        }]);
    });

    it('should filter a array', function () {
        var arr = (new Data({
            data: {
                arr: [0, 1, 2, 3]
            }
        })).arr;

        arr.filter(function (v) {
            return v < 2;
        }).forEach(function (v) {
            (v < 2).should.be.true;
        });
    });
})
