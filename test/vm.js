describe('data', function () {
    it('should able to get a vm data', function () {
        Q.define('hello', {
            filters: {
                prepend: function (value) {
                    return 'hello ' + value;
                }
            }
        });
        var vm = new Q({
            el: '#tpl',
            data: {
                msg: 'hello',
                obj: {
                    msg: 'world'
                }
            }
        });
    });
});
