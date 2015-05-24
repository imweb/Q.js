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
            }
        });
        // require hello component
        Q.require('hello').options.filters.should.have.property('prepend');
    });

    it('should able to create a child component', function (done) {
        var vm = new Q({
            el: '#component',
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
            $('#msg1', '#component').text().should.equal('hello');
            $('#msg2', '#component').text().should.equal('hello world');

            vm.obj.$set('msg', 'hhhh');
            done();
        }, 100);
    });

    it('should able to set the data of a children component', function () {
        var vm = Q.get('#component');
        vm.$set('msg', 'nihao');
        vm.obj.$set('msg', 'tencent');
        $('#msg1', '#component').text().should.equal('nihao');
        $('#msg2', '#component').text().should.equal('hello tencent');
    });
});
