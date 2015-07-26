module.exports = function (Q) {
    var div;
    before(function () {
        div = document.createElement('div');
        div.innerHTML =
            '<div id="component1" style="display: none">\
                <p q-text="msg" id="msg1"></p>\
                <div q-vm="hello" q-with="obj" q-ref="test">\
                    <p q-text="msg | prepend" id="msg2"></p>\
                    <button q-on="click: sayHello" id="test-button">hello</button>\
                </div>\
            </div>\
            <div id="component2" style="display: none">\
                <div q-vm="nihao">\
                    <p q-text="isMike | whoSay" id="msg3"></p>\
                </div>\
            </div>\
            <div id="component3" style="display: none">\
                <div q-vm="lala" q-ref="lala">\
                    <p q-text="msg" id="msg4"></p>\
                </div>\
            <div>';
        document.body.appendChild(div);
    });

    describe('class', function () {
        it('should able to define & require a hello component', function () {
            // define hello component
            Q.define('hello', {
                data: {
                    msg: 'world'
                },
                filters: {
                    prepend: function (value) {
                        return 'hello ' + value;
                    }
                },
                methods: {
                    sayHello: function () {
                        // trigger say event and pass hello
                        this.$emit('say', 'hello');
                    }
                }
            });
            // require hello component
            Q.require('hello').options.filters.should.have.property('prepend');
        });

        it('should able to create a child component', function (done) {
            var vm = new Q({
                el: '#component1',
                data: {
                    msg: 'hello',
                    obj: {}
                }
            });
            setTimeout(function () {
                vm._children.length.should.equal(1);
                Q.require('hello', function (VM) {
                    (vm.$['test'] instanceof VM)
                        .should.be.ok;
                });
                $('#msg1', '#component1').text().should.equal('hello');
                $('#msg2', '#component1').text().should.equal('hello world');

                vm.obj.$set('msg', 'hhhh');
                done();
            }, 100);
        });

        it('should able to set the data of a children component', function (done) {
            var vm = Q.get('#component1');
            vm.$set('msg', 'nihao');
            vm.obj.$set('msg', 'tencent');
            $('#msg1', '#component1').text().should.equal('nihao');
            $('#msg2', '#component1').text().should.equal('hello tencent');

            vm.$on('say', function (data) {
                data.should.equal('hello');
                this.should.equal(vm.$.test);
                done();
            });
            $('#test-button')[0].click();
        });

        it('should able extend the child component options automatically', function (done) {
            Q.define('nihao', {
                data: {
                    isMike: false
                },
                filters: {
                    whoSay: function (isMike) {
                        return 'Nihao ' + (isMike ? 'Mike' : 'Daniel');
                    }
                }
            });

            var vm = new Q({
                el: '#component2'
            });

            $('#msg3', '#component2').text().should.equal('Nihao Daniel');
            vm.isMike.should.be.not.ok;

            setTimeout(function () {
                vm.$set('isMike', true);
                $('#msg3', '#component2').text().should.equal('Nihao Mike');
                vm.isMike.should.be.ok;
                done();
            }, 100);
        });

        it('should able trigger the parent data change', function (done) {
            Q.define('lala', {
                data: {}
            });

            var vm = new Q({
                el: '#component3',
                data: {}
            });

            setTimeout(function () {
                vm.$.lala.$set('msg', 'lala');
                $('#msg4', '#component3').text().should.equal('lala');
                vm.msg.should.equal('lala');
                done();
            }, 100);
        });
    });

    after(function () {
        document.body.removeChild(div);
    });
};
