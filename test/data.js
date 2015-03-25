describe('data', function () {
    it('should able to get a vm data', function () {
        var vm = new Q({
            el: null,
            data: {
                msg: 'hello',
                list: [
                    {
                        text: 'tencent'
                    },
                    {
                        text: 'donaldyang'
                    }
                ]
            }
        });

        vm.msg.should.equal('hello');
        vm.list[1].text.should.equal('donaldyang');
    });

    it('should able to set a vm data', function () {
        var vm = new Q({
            el: null,
            data: {
                msg: 'hello',
                list: [
                    {
                        text: 'tencent'
                    },
                    {
                        text: 'donaldyang'
                    }
                ]
            }
        });

        vm.$set('msg', 'nihao');
        vm.msg.should.equal('nihao');
        vm.list[1].$set('text', 'hello');
        vm.list[1].text.should.equal('hello');
    });

    it('should able to set a vm data', function () {
        var vm = new Q({
            el: null,
            data: {
                msg: 'hello',
                list: [
                    {
                        text: 'tencent'
                    },
                    {
                        text: 'donaldyang'
                    }
                ]
            }
        });

        vm.list.push({ text: 'nihao' });
        vm.list[2].text.should.equal('nihao');
        vm.list.length.should.equal(3);
    });

    it('should able to pop a vm data', function () {
        var vm = new Q({
            el: null,
            data: {
                msg: 'hello',
                list: [
                    {
                        text: 'tencent'
                    },
                    {
                        text: 'donaldyang'
                    }
                ]
            }
        });

        vm.list.pop().text.should.equal('donaldyang');
        vm.list.length.should.equal(1);
    });

    it('should able to unshift a vm data', function () {
        var vm = new Q({
            el: null,
            data: {
                msg: 'hello',
                list: [
                    {
                        text: 'tencent'
                    },
                    {
                        text: 'donaldyang'
                    }
                ]
            }
        });

        vm.list.unshift({ text: 'good' });
        vm.list[0].text.should.equal('good');
        vm.list.length.should.equal(3);
    });

    it('should able to shift a vm data', function () {
        var vm = new Q({
            el: null,
            data: {
                msg: 'hello',
                list: [
                    {
                        text: 'tencent'
                    },
                    {
                        text: 'donaldyang'
                    }
                ]
            }
        });

        vm.list.shift().text.should.equal('tencent');
        vm.list.length.should.equal(1);
    });

    it('should able to call indexOf for a DataArray', function () {
        var vm = new Q({
            el: null,
            data: {
                msg: 'hello',
                list: [
                    {
                        text: 'tencent'
                    },
                    {
                        text: 'donaldyang'
                    }
                ]
            }
        });

        vm.list.indexOf(vm.list[1]).should.equal(1);
    });

    it('should able to call splice for a DataArray', function () {
        var vm = new Q({
            el: null,
            data: {
                msg: 'hello',
                list: [
                    {
                        text: 'tencent'
                    },
                    {
                        text: 'donaldyang'
                    }
                ]
            }
        });

        vm.list.splice(0, 1);
        vm.list.length.should.equal(1);
        vm.list[0].text.should.equal('donaldyang');
    });

    it('should return itself when key is undefined', function () {
        var vm = new Q({
            el: null,
            data: {}
        });

        vm.data().should.equal(vm);
    });

    it('should able to watch vm change', function (done) {
        var vm = new Q({
            el: null,
            data: {}
        });

        vm.$watch('', function (value) {
            value.should.equal(vm);
            done();
        }, true, false);

        vm.$set('test', 'test');
    });

    it('should able traversing a array which has some property', function () {
        var arr = [1, 2, 3, 4],
            l = arr.length;

        arr.flag = true;
        var vm = new Q({
            el: null,
            data: {
                arr: arr
            }
        });
        vm.arr.length.should.equal(l);
        vm.arr.forEach(function (item, i) {
            item.should.equal(i + 1);
        });
        vm.arr.flag.should.be.ok;
    });
});
