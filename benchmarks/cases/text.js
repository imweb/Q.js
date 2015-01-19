var suite = new Benchmark.Suite,
    test = $('#test'),
    q = new Q({
        el: '#test',
        data: {}
    }), node = test[0];

// add tests
suite.add('Q.js#text', function() {
    q.$set('msg', Math.random() * 1000 | 0);
})
.add('jQuery#text', function() {
    test.text(Math.random() * 1000 | 0);
})
.add('Native#innerText', function() {
    node.innerText = Math.random() * 1000 | 0;
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
