describe('custom', function () {
    it('should able to create a custom filter', function () {
        var vm = new Q({
            el: '#custom1',
            data: {
                msg: 'hello'
            },
            directives: {
                msg: function (val, oldVal) {
                    if (oldVal) oldVal.should.equal('hello');
                    this.data('msg').should.equal(val);
                    this.el.setAttribute('data-msg', val);
                }
            }
        });

        $('#custom1 p')[0].getAttribute('data-msg').should.equal('hello');

        vm.$set('msg', 'nihao');

        $('#custom1 p')[0].getAttribute('data-msg').should.equal('nihao');
    });
});

describe('if', function () {
    it('should able to use if directive', function () {
        var vm = new Q({
            el: '#if1',
            data: {
                exist: false,
                msg: 'hello world'
            }
        });

        $('#if1 p').length.should.equal(0);

        vm.$set('exist', true);

        $('#if1 p').length.should.equal(1);
        $('#if1 p')[0].innerText.should.equal('hello world');
    });
});

describe('attrbute', function () {
    it('should able to set src', function () {
        var attrTpl1 = new Q({
            el: '#attr1',
            data: {
                url: 'http://9.url.cn/edu/img/index/bg-logo-new.385c8.png'
            }
        });

        $('#attr1 img')[0].src.should.equal('http://9.url.cn/edu/img/index/bg-logo-new.385c8.png');
    });

    it('should able to set attribute', function () {
        var attrTpl2 = new Q({
            el: '#attr2',
            data: {
                id: 2
            }
        });

        $('#attr2 span')[0].getAttribute('data-id').should.equal('2');
    });
});


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

    it('should able push a data', function (done) {
        tpl1.items.push({ msg: 'nihao' });

        setTimeout(function () {
            var lis = $('li', '#tpl1');
            lis.length.should.equal(3);
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

    it('should able to use double repeat', function (done) {
        var vm = new Q({
            el: '#multi-repeat',
            data: {
                msgs: [
                    {
                        text: 'hello'
                    },
                    {
                        text: 'hello'
                    }
                ]
            }
        });

        setTimeout(function () {
            var ps = $('#multi-repeat div p');
            for (var i = 0, l = ps.length; i < l; i++) {
                ps[i].innerText.should.equal('hello');
            }
            done();
        }, 200);
    });
});
