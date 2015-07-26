module.exports = function (Q) {
    var div;
    before(function () {
        div = document.createElement('div');
        div.innerHTML =
            '<div id="on1" style="display: none">\
                <button q-on="click: onclick">hello</button>\
            </div>\
            <div id="on2" style="display: none">\
                <button q-on="click: onclick(this)">hello</button>\
                <ul>\
                    <li q-repeat="msgs">\
                        <button q-on="click: clickItem(this)">hello</button>\
                    </li>\
                </ul>\
            </div>\
            <div id="class1" style="display: none">\
                <div class="toggle-me" q-class="toggle-me: toggle"></div>\
            </div>\
            <div id="class2" style="display: none">\
                <div q-class="classname"></div>\
            </div>\
            <div id="if1" style="display: none">\
                <p q-if="exist" q-text="msg"></p>\
            </div>\
            <div id="if2" style="display: none">\
                <p q-if="exist" q-text="msg"></p>\
            </div>\
            <div id="if3" style="display: none">\
                <button q-if="exist" q-on="click: click"></button>\
            </div>\
            <div id="custom1" style="display: none;">\
                <p q-msg="msg"></p>\
            </div>\
            <div id="attr1" style="display: none">\
                <img src="about:blank" q-attr="src: url">\
            </div>\
            <div id="attr2" style="display: none">\
                <span q-attr="data-id: id">id</span>\
            </div>\
            <div id="attr3" style="display: none">\
                <span q-attr="style: styles">styles</span>\
            </div>\
            <ul id="tpl1" style="display: none">\
                <li q-repeat="items" q-text="msg"></li>\
            </ul>\
            <div id="tpl2" style="display: none">\
                <div q-repeat="items">\
                    <p q-repeat="msgs" q-text="text"></p>\
                </div>\
            </div>\
            <div id="tpl3" style="display: none">\
                <div q-repeat="items"></div>\
                <div q-repeat="lists | noresult"></div>\
            </div>\
            <div id="tpl5" style="display: none">\
                <a q-text="msg | noexist"></a>\
            </div>\
            <div id="multi-repeat" style="display: none">\
                <div>\
                    <p q-repeat="msgs" q-text="text"></p>\
                </div>\
                <div>\
                    <p q-repeat="msgs" q-text="text"></p>\
                </div>\
            </div>';
        document.body.appendChild(div);
    });

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

    describe('class', function () {
        it('should able to toggle class', function () {
            var vm = new Q({
                el: '#class1',
                data: {
                    toggle: true
                }
            });

            var toggle = $('.toggle-me', '#class1');
            toggle.length.should.equal(1);

            vm.$set('toggle', false);
            toggle.hasClass('toggle-me').should.equal(false);
        });

        it('should able to set a class', function () {
            var vm = new Q({
                el: '#class2',
                data: {
                    classname: 'oneclass'
                }
            });

            var div = $('div', '#class2');
            div.hasClass('oneclass').should.equal(true);

            vm.$set('classname', 'anotherclass');
            div.hasClass('oneclass').should.equal(false);
            div.hasClass('anotherclass').should.equal(true);

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
            $('#if1 p')[0].textContent.should.equal('hello world');
        });

        it('should able to use if directive', function () {
            var vm = new Q({
                el: '#if2',
                data: {
                    exist: true,
                    msg: 'hello world'
                }
            });

            $('#if1 p').length.should.equal(1);
            $('#if1 p')[0].textContent.should.equal('hello world');
        });

        it('should just click one time for if directive', function (done) {
            var vm = new Q({
                el: '#if3',
                data: {
                    exist: true
                },
                methods: {
                    click: function () {
                        done();
                    }
                }
            });

            $('#if3 button')[0].click();
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

        it('should able to set style', function () {
            var attrTpl2 = new Q({
                el: '#attr3',
                data: {
                    styles: {
                        fontWeight: 'bold'
                    }
                }
            });

            $('#attr3 span')[0].style.fontWeight.should.equal('bold');
        });
    });

    describe('on', function () {
        it('should able bind event', function (done) {
            new Q({
                el: '#on1',
                methods: {
                    onclick: function () {
                        done();
                    }
                }
            });
            // just button has click method in phantomjs
            // https://github.com/ariya/phantomjs/issues/10795
            $('button', '#on1')[0].click();
        });

        it('should able bind event', function (done) {
            new Q({
                el: '#on2',
                data: {
                    msgs: [
                        {
                            text: 'hello'
                        }
                    ]
                },
                methods: {
                    onclick: function (data) {
                        data.should.equal(this);
                    },
                    clickItem: function (data) {
                        data.should.equal(this.msgs[0]);
                        done();
                    }
                }
            });


            setTimeout(function () {
                var buttons = $('button', '#on2');
                buttons[0].click();
                buttons[1].click();
            }, 100);

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
                lis[0].textContent.should.equal('hello');
                lis[1].textContent.should.equal('world');
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

        it('should able splice a data', function (done) {
            tpl1.items.splice(0, 2);

            setTimeout(function () {
                var lis = $('li', '#tpl1');
                lis.length.should.equal(1);
                lis[0].textContent.should.equal('nihao');
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
                ps[0].textContent.should.equal('hello');
                ps[1].textContent.should.equal('world');
                ps = $(divs[1]).find('p');
                ps[0].textContent.should.equal('hello');
                ps[1].textContent.should.equal('qq');
                done();
            }, 200);
        });

        it('should not throw a error when array is not defined', function () {
            new Q({
                el: '#tpl3',
                data: {
                    lists: {}
                },
                filters: {
                    noresult: function (v) {
                        return v['xxx'];
                    }
                }
            });
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
                ps.length.should.equal(4);
                for (var i = 0, l = ps.length; i < l; i++) {
                    ps[i].textContent.should.equal('hello');
                }
                vm.$set('msgs', [{
                    text: 'nihao'
                }, {
                    text: 'nihao'
                }]);

                setTimeout(function () {
                    ps = $('#multi-repeat div p');
                    ps.length.should.equal(4);
                    for (var i = 0, l = ps.length; i < l; i++) {
                        ps[i].textContent.should.equal('nihao');
                    }
                    done();
                }, 200);
            }, 200);
        });
    });

    after(function () {
        document.body.removeChild(div);
    })
};
