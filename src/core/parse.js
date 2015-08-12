var cache = new (require('./cache'))(1000),
    tokens = [
        // space
        [/^ +/],
        // arg
        [/^([\w\-]+):/, function (captures, status) {
            status.token.arg = captures[1];
        }],
        // function
        [/^([\w]+)\((.+?)\)/, function (captures, status) {
            status.token.target = captures[1];
            status.token.param = captures[2].split(/ *, */);
        }],
        // target
        [/^([\w\-\.\$]+)/, function (captures, status) {
            status.token.target = captures[1];
        }],
        // filter
        [/^(?=\|)/, function (captures, status) {
            status.filter = true;
        }],
        // next
        [/^,/, function (captures, status, res) {
            res.push(status.token);
            status.token = {
                filters: []
            };
        }]
    ],
    filterREG = /^(.+?)(?=,|$)/,
    filterTokens = [
        // space
        [/^ +/],
        // filter
        [/^\| *([\w\-\!]+)/, function (captures, filters) {
            filters.push([captures[1]]);
        }],
        // string
        [/^(['"])(((\\['"])?([^\1])*)+)\1/, function (captures, filters) {
            filters[filters.length - 1].push(captures[3]);
        }],
        // arg
        [/^([\w\-\$]+)/, function (captures, filters) {
            filters[filters.length - 1].push(captures[1]);
        }]
    ];
/**
 * click: onclick | filter1 | filter2
 * click: onclick , keydown: onkeydown
 * click: onclick(this)
 * click: onclick(e, this)
 * value1 | filter1 | filter2
 * value - 1 | filter1 | filter2   don't support
 */
function parse(str) {
    var name = str,
        hit = cache.get(name);
    if (hit) return hit;

    var res = [],
        captures,
        i,
        l = tokens.length,
        foo,
        // if has token or not
        has = false,
        status = {
            // if in filter or not
            filter: false,
            // just token object
            token: {
                filters: []
            }
        };

    while (str.length) {
        for (i = 0; i < l; i++) {
            if (captures = tokens[i][0].exec(str)) {
                has = true;
                foo = tokens[i][1];
                foo && foo(captures, status, res);
                str = str.replace(tokens[i][0], '');
                if (status.filter) {
                    captures = filterREG.exec(str);
                    parseFilter(captures[0].trim(), status.token);
                    str = str.replace(filterREG, '');
                    status.filter = false;
                }
                break;
            }
        }
        if (has) {
            has = false;
        } else {
            throw new Error('Syntax error at: ' + str);
        }
    }

    res.push(status.token);
    cache.put(name, res);
    return res;
}

function parseFilter(str, token) {
    var i, l = filterTokens.length,
        has = false;
    while (str.length) {
        for (i = 0; i < l; i++) {
            if (captures = filterTokens[i][0].exec(str)) {
                has = true;
                foo = filterTokens[i][1];
                foo && foo(captures, token.filters);
                str = str.replace(filterTokens[i][0], '');
                break;
            }
        }
        if (has) {
            has = false;
        } else {
            throw new Error('Syntax error at: ' + str);
        }
    }
}

module.exports = parse;
