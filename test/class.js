describe('class', function () {
    it('should able to define & require a hello component', function () {
        // define hello component
        Q.define('hello', {
            filters: {
                prepend: function (value) {
                    return 'hello ' + value;
                }
            }
        });
        // require hello component
        Q.require('hello').options.filters.should.have.property('prepend')
    });

    it('should able to create a child component', function (done) {
        var vm = new Q({
            el: '#component',
            data: {
                msg: 'hello',
                obj: {
                    msg: 'world'
                }
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
            done();
        }, 100);
    });
});
