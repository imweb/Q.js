var suite = new Benchmark.Suite,
    test = $('#test'),
    q = new Q({
        el: '#test',
        data: { list: [] }
    }), node = test[0];

function tpl(list) {
    var res = [];
    for (var i = 0, l = list.length; i < l; i++) {
        res.push('<li>' + list[i].msg + '</li>');
    }
    return res.join('');
}

// add tests
suite.add('Q.js#repeat', {
    defer: 'true',
    fn: function(defer) {
        q.$set('list', [
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() },
            { msg: 'hehe' + Math.random() }
        ]);
        q.$once('repeat-render', function () {
            defer.resolve();
        });
    }
})
.add('template#render', function() {
    $('#test').html(tpl([
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() },
        { msg: 'hehe' + Math.random() }
    ]));
})
// .add('Native#innerText', function() {
//     //node.innerText = Math.random() * 1000 | 0;
// })
// add listeners
.on('cycle', function(event) {
    console.log(String(event.target));
})
.on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': true });
