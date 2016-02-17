module.exports = function (Q) {
    var div;
    before(function () {
        div = document.createElement('div');
        div.innerHTML =
            '<p id="cloak" q-cloak></p>';
        document.body.appendChild(div);
    });

    describe('cloak', function () {
        it('should able to use cloak', function () {
            var q = new Q({
                el: '#cloak',
                data: {
                    msg: 'test'
                }
            });

            $('#cloak[q-cloak]').length.should.equal(1);
            q.$set('msg', 'hello');
            $('#cloak[q-cloak]').length.should.equal(0);
        });
    });

    after(function () {
        document.body.removeChild(div);
    });
};
