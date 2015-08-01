module.exports = function (Q) {
    var div;
    before(function () {
        div = document.createElement('div');
        div.innerHTML =
            '<ul id="tpl1" style="display: none">\
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
    });

    after(function () {
        document.body.removeChild(div);
    })
};
