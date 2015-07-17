var cache = new (require('./cache'))(1000);
/**
 * click: onclick | filter1 | filter2
 * click: onclick , keydown: onkeydown
 * value1 | filter1 | filter2
 * value - 1 | filter1 | filter2   don't support
 */
function parse(str) {
    var hit = cache.get(str);
    if (hit) return hit;

    var arr = [];
    var words = getWords(str);
    var exps = splitArrayByItem(words, ',');
    var keyReg = /^[\w\-]+$/;

    exps.forEach(function(exp) {
        var pipes = splitArrayByItem(exp, '|');
        var targetInfo = pipes[0];
        var res = {
            filters: pipes.slice(1)
        };
        if (targetInfo[1] === ':') {
            res.arg = targetInfo[0];
            targetInfo.splice(0, 2);
        }
        if (keyReg.test(targetInfo[0])) {
            res.target = targetInfo[0];
        } else {
            // 'click: select(this)' 词法分析保准不把()分割成单独单词
            res.exp = targetInfo[0];
        }
        arr.push(res);
    });
    cache.put(str, arr);
    return arr;
}

/**
 * 词法分析
 * @param {string} str
 * @return {Array<string>} 
 */
function getWords(str) {
    var words = [];
    var quote = null; // 在引号中 ' or "
    var quoteEscape = false; // 引号中上一个字符为\转义
    var w = ''; // pending word
    var spaces = /[\s]/; // 空格
    var oneCharWord = /[|,:]/; // 必须单个字符的单词

    function push() {
        w && words.push(w);
        w = '';
    }

    for (var i = 0; i < str.length; i++) {
        var ch = str.charAt(i);
        if (quote) {
            if (quoteEscape) {
                // leave escape
                quoteEscape = false;
                w += ch;
            } else if (ch === '\\') {
                // enter escape
                quoteEscape = true;
            } else if (ch === quote) {
                // leave quote
                quote = false;
                push();
            } else {
                w += ch;
            }
        } else if (ch === '\'' || ch === '"') {
            // enter quote
            push();
            quote = ch;
        } else if (spaces.test(ch)) {
            push();
        } else if (oneCharWord.test(ch)) {
            push();
            words.push(ch);
        } else {
            w += ch;
        }
    }
    push();
    return words;
}

/**
 * 分割数组
 * @param {Array} arr
 * @param {Object} item
 * @return {Array<Array>}
 */
function splitArrayByItem(arr, item) {
    var result = [[]];
    for (var i in arr) {
        var curr = arr[i];
        if (item === curr) {
            result.push([]);
        } else {
            result[result.length - 1].push(curr);
        }
    }
    return result;
}

module.exports = parse;
