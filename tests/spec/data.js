module.exports = function (Q) {

    describe('data', function () {
        it('should return itself when key is undefined', function () {
            var vm = new Q({
                el: null,
                data: {}
            });

            vm.data().should.equal(vm);
        });

        it('should able to watch vm change', function (done) {
            var vm = new Q({
                el: null,
                data: {}
            });

            vm.$watch('', function (value) {
                value.should.equal(vm);
                done();
            }, true, false);

            vm.$set('test', 'test');
        });

        it('should able to watch push method', function (done) {
            var vm = new Q({
                el: null,
                data: {
                    arr: [1, 2]
                }
            });

            vm.$watch('arr', function (value, oldVal, patch) {
                value[2].should.equal(3);
                patch.method.should.equal('push');
                patch.res[0].should.equal(3);
                patch.args[0].should.equal(3);
                done();
            });

            vm.arr.push(3);
        });

        it('should able to watch splice method', function (done) {
            var vm = new Q({
                el: null,
                data: {
                    arr: [1, 2, 3]
                }
            });

            vm.$watch('arr', function (value, oldVal, patch) {
                (value[2] === undefined).should.be.true;
                value.length.should.equal(2);
                patch.method.should.equal('splice');
                patch.args.should.eql([1, 1]);
                done();
            });

            vm.arr.splice(1, 1);
        });

        it('should able to watch pop method', function (done) {
            var vm = new Q({
                el: null,
                data: {
                    arr: [1, 2, 3]
                }
            });

            vm.$watch('arr', function (value, oldVal, patch) {
                (value[2] === undefined).should.be.true;
                value.length.should.equal(2);
                done();
            });

            vm.arr.pop();
        });

        it('should able to watch shift method', function (done) {
            var vm = new Q({
                el: null,
                data: {
                    arr: [1, 2, 3]
                }
            });

            vm.$watch('arr', function (value, oldVal, patch) {
                (value[2] === undefined).should.be.true;
                value.length.should.equal(2);
                done();
            });

            vm.arr.shift();
        });
    });

};
