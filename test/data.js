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
        vm.list.pop().text.should.equal('nihao');
        vm.list.length.should.equal(2);
        vm.list.unshift({ text: 'good' });
        vm.list[0].text.should.equal('good');
        vm.list.length.should.equal(3);
        vm.list.shift().text.should.equal('good');
        vm.list.length.should.equal(2);
        vm.list.indexOf(vm.list[1]).should.equal(1);
        vm.list.splice(0, 1);
        vm.list.length.should.equal(1);
        vm.list[0].text.should.equal('hello');
    });
});
