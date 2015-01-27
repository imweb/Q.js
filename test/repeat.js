describe('data', function () {
    it('should able to get a vm data', function () {
        var vm = new Q({
            el: '#tpl',
            data: {
                items: [
                    { msgs: [{ text: '123' }, { text: '321' }] },
                    { msgs: [{ text: '123' }, { text: '321' }] }
                ]
            }
        });
        console.log(vm);
    });
});
