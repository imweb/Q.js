var suite = new Benchmark.Suite,
    test = $('[q-text="msg"]'),
    q = new Q({
        el: '#test',
        data: {}
    }), nodes = function (test) {
        var res = [];
        for (var i = 0, l = test.length; i < l; i++) {
            res[i] = test[i];
        }
        return res;
    }(test);

// add tests
suite.add('Q.js#text', function() {
    q.$set('msg', Math.random() * 1000 | 0);
})
.add('jQuery#text', function() {
    test.text(Math.random() * 1000 | 0);
})
.add('Native#innerText', function() {
    var res = Math.random() * 1000 | 0;
    nodes.forEach(function (node) {
        node.innerText = res;
    });
})
// add listeners
.on('cycle', function(event) {
    console.log(String(event.target));
})
.on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': true });
