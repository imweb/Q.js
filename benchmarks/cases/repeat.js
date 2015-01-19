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

function prepare(n) {
    var res = [];
    for (; n--;) {
        res.push({
            msg: 'hehe' + Math.random()
        });
    }
    return res;
}

// add tests
suite.add('Q.js#repeat', {
    defer: 'true',
    fn: function(defer) {
        q.$set('list', prepare(1000));
        q.$once('repeat-render', function () {
            defer.resolve();
        });
    }
})
.add('template#render', {
    defer: true,
    fn: function(defer) {
        setTimeout(function () {
            $('#test').html(tpl(prepare(1000)));
            defer.resolve();
        }, 0);
    }
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
