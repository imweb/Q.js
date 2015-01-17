/**
 * click: onclick | filter1 | filter2
 * click: onclick , keydown: onkeydown
 * value1 | filter1 | filter2
 * value - 1 | filter1 | filter2   don't support
 */
function parse(str) {
    var exps = str.trim().split(/ *\, */),
        eventReg = /^([\w\-]+)\:/,
        keyReg = /^[\w\-]+$/,
        arr = [];
    exps.forEach(function (exp) {
        var res = {},
            match = exp.match(eventReg),
            filters, exp;
        if (match) {
            res.arg = match[1];
            exp = exp.substring(match[0].length).trim();
        }
        filters = exp.split(/ *\| */);
        exp = filters.shift();
        if (keyReg.test(src)) {
            res.target = exp;
        } else {
            res.exp = exp;
        }
        res.filters = filters;
        arr.push(res);
    });
    return arr;
}

module.exports = parse;
