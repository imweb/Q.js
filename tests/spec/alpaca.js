module.exports = function (Q) {
    var div;
    before(function () {
        div = document.createElement('div');
        div.innerHTML =
            '<p id="alpaca" q-text="msg"></p>';
        document.body.appendChild(div);
    });

    describe('alpaca', function () {
        it('should able to use alpaca', function () {
            Q._.alpaca.should.equal(false);
            Q._.alpaca = true;
            var q = new Q({
                el: '#alpaca',
                data: {
                    msg: 'test'
                }
            });
            $('#alpaca')[0].innerHTML.should.not.equal('test');
            q.$set('msg', 'hello');
            $('#alpaca')[0].innerHTML.should.equal('hello');
            Q._.alpaca = false;
        });
    });

    after(function () {
        document.body.removeChild(div);
    });
};
