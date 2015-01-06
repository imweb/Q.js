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

        vm.data().find('msg').get().should.equal('hello');
        vm.data('msg').get().should.equal('hello');
        vm.data('list.1.text').get().should.equal('donaldyang');
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

        vm.data().set('msg', 'nihao');
        vm.data('msg').get().should.equal('nihao');
    });
});
