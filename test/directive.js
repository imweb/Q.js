
describe('repeat', function () {
    var tpl1

    it('should able repeat', function (done) {
        tpl1 = new Q({
            el: '#tpl1',
            data: {
                items: [
                    { msg: 'hello' },
                    { msg: 'world' }
                ]
            }
        });

        setTimeout(function () {
            var lis = $('li', '#tpl1');
            lis.length.should.equal(2);
            lis[0].innerText.should.equal('hello');
            lis[1].innerText.should.equal('world');
            done();
        }, 100);
    });

    it('should able multiple repeat', function (done) {
        new Q({
            el: '#tpl2',
            data: {
                items: [
                    { msgs: [{ text: 'hello' }, { text: 'world' }] },
                    { msgs: [{ text: 'hello' }, { text: 'qq' }] }
                ]
            }
        });
        setTimeout(function () {
            var divs = $('div', '#tpl2'), ps;
            divs.length.should.equal(2);
            ps = $(divs[0]).find('p');
            ps[0].innerText.should.equal('hello');
            ps[1].innerText.should.equal('world');
            ps = $(divs[1]).find('p');
            ps[0].innerText.should.equal('hello');
            ps[1].innerText.should.equal('qq');
            done();
        }, 100);
    });

    it('should not throw a error when repeat element has been modified', function (done) {
        var container = document.getElementById('tpl1'), i = 0, l,
            nodes = container.childNodes;
        // remove repeat element
        for (l = nodes.length; i < l; i++) {
            if (nodes[i].tagName === 'LI') {
                container.removeChild(nodes[i]);
                break;
            }
        }
        tpl1.$set('items', [
            { msg: 'hello' },
            { msg: 'world' }
        ]);
        done();
    });

    it('should able bind event', function (done) {
        new Q({
            el: '#tpl3',
            methods: {
                onclick: function () {
                    done();
                }
            }
        });
        // just button has click method in phantomjs
        // https://github.com/ariya/phantomjs/issues/10795
        $('button', '#tpl3')[0].click();
    });

    it('should able to toggle class', function () {
        var vm = new Q({
            el: '#tpl4',
            data: {
                toggle: true
            }
        });

        var toggle = $('.toggle-me', '#tpl4');
        toggle.length.should.equal(1);

        vm.$set('toggle', false);
        toggle.hasClass('toggle-me').should.equal(false);
    });

    it('should throw a error when a filter hasn\'t implemented', function () {
        (function () {
            var vm = new Q({
                el: '#tpl5',
                data: {
                    msg: 'hello'
                }
            });
        }).should.throw('Filter noexist hasn\'t implemented.');
    });
});
