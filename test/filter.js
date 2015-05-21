describe('filter', function () {
    var vm;
    it('should able to use a filter', function () {
        vm = new Q({
            el: '#filter1',
            data: {
                msg: 'hello'
            },
            filters: {
                append: function (val, str, oldVal) {
                    if (oldVal) oldVal.should.equal('hello');
                    return [val, str].join(' ');
                }
            }
        });

        $('#filter1 p')[0].innerText.should.equal('hello world');

        vm.$set('msg', 'nihao');

        $('#filter1 p')[0].innerText.should.equal('nihao world');
    });
});
