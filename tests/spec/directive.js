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
            <div id="on3" style="display: none">\
                <button q-on="click: onclick(e, this)">hello</button>\
            </div>\
            <div id="on4" style="display: none">\
                <button q-on="click: onclick(\'test\')">hello</button>\
            </div>\
            <div id="on5" style="display: none">\
                <button q-on="click: onclick(this)">hello</button>\
                <ul>\
                    <li q-repeat="msgs">\
                        <button q-on="click: clickItem(text, xx)">hello</button>\
                    </li>\
                </ul>\
            </div>\
            <div id="on6" style="display: none">\
                <ul>\
                    <li q-repeat="msgs">\
                        <button q-on="click: clickItem(this, e, text, xx)">hello</button>\
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
            <div id="text1" style="display: none">\
                <a q-text="msg | noexist"></a>\
            </div>\
            <div id="text2" style="display: none">\
                <p q-text="object.msg"></p>\
            </div>\
            <div id="el1" style="display: none">\
                <div id="el-ref1" q-el="ref"></div>\
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

        it('should able bind event in array', function (done) {
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
        it('should able bind event with param', function (done) {
            new Q({
                el: '#on3',
                methods: {
                    onclick: function (e, data) {
                        e.target.tagName.should.equal('BUTTON');
                        data.should.equal(this);
                        done();
                    }
                }
            });
            $('button', '#on3')[0].click();
        }); 
        it('should able bind event with string param', function (done) {
            new Q({
                el: '#on4',
                methods: {
                    onclick: function (str) {
                        str.should.equal('test');
                        done();
                    }
                }
            });
            $('button', '#on4')[0].click();
        });
        it('should able bind event with property of data', function (done) {
            new Q({
                el: '#on5',
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
                    clickItem: function (data, errParam) {
                        data.should.equal('hello');
                        (errParam === undefined).should.be.true;
                        done();
                    }
                }
            });


            setTimeout(function () {
                var buttons = $('button', '#on5');
                buttons[0].click();
                buttons[1].click();
            }, 100);

        });
        it('should able bind event with all type of param', function (done) {
            new Q({
                el: '#on6',
                data: {
                    msgs: [
                        {
                            text: 'hello'
                        }
                    ]
                },
                methods: {
                    clickItem: function (data, e, text, errParam) {
                        data.should.equal(this.msgs[0]);
                        e.target.tagName.should.equal('BUTTON');
                        text.should.equal('hello');
                        (errParam === undefined).should.be.true;
                        done();
                    }
                }
            });


            setTimeout(function () {
                var buttons = $('button', '#on6');
                buttons[0].click();
            }, 100);

        });
    });

    describe('directives', function () {

        it('should throw a error when a filter hasn\'t implemented', function () {
            (function () {
                var vm = new Q({
                    el: '#text1',
                    data: {
                        msg: 'hello'
                    }
                });
            }).should.throw('Filter noexist hasn\'t implemented.');
        });

        it('should able to use object.msg', function () {
            var vm = new Q({
                el: '#text2',
                data: {
                    object: {
                        msg: 'hello'
                    }
                }
            });

            $('#text2 p').text().should.equal('hello');
        });

        it('should get a element reference', function (done) {
            new Q({
                el: '#el1',
                ready: function () {
                    this.$$['ref'].should.equal($('#el-ref1')[0]);
                    done();
                }
            });
        });
    });

    after(function () {
        document.body.removeChild(div);
    })
};
