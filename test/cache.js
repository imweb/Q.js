var Cache = require('./cache');

describe('cache', function () {
    it('should able to cache data', function () {
        var cache = new Cache(3);
        cache.put('test', 'test');
        cache.get('test').should.equal('test');
    });

    it('should able to override a key', function () {
        var cache = new Cache(3);
        cache.put('test', 'test');
        cache.put('test', 'hello world');
        cache.get('test').should.equal('hello world');
    });

    it('should able to kick out the unnecessary data', function () {
        var cache = new Cache(2);
        cache.put('key1', 'value1');
        cache.put('key2', 'value2');
        cache.put('key3', 'value3');
        (cache.get('key1') === undefined).should.be.ok;
        cache.get('key3').should.equal('value3');
        cache.get('key2').should.equal('value2')
    });
});
