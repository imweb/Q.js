module.exports = function (Q) {
    var div;
    before(function () {
        div = document.createElement('div');
        div.innerHTML =
            '<div id="filter1" style="display: none">\
                <p class="text1" q-text="china | prop capital name | fmt \'china\\\'s capital is ${}\'"></p>\
                <p class="text2" q-text="china | fmt \'china\\\'s capital is ${capital.name}\'"></p>\
            </div>';
        document.body.appendChild(div);
    });

    describe('filters', function () {
        it('filters should working', function () {
            var vm = new Q({
                el: '#filter1',
                data: {
                    china: {
                        capital: {
                            name: 'Beijing'
                        }
                    }
                },
                filters: {
                    prop: function(obj) {
                        var props = [].slice.call(arguments, 1);
                        // 最后一个参数是old value
                        props.pop();
                        var root = obj;
                        while (props.length) {
                            root = root[props.shift()];
                        }
                        return root;
                    },

                    fmt: function(obj, pattern, oldValue) {

                        return pattern.replace(/\\/g, '')
                            .replace(/\$\{([^}]*)\}/g, function(str) {
                                var $1 = str.substring(2, str.length - 1);
                                if (!$1) {
                                    return obj;
                                }
                                var prop = undefined;
                                try {
                                    prop = eval(
                                        ['obj', $1]
                                            .join($1.charAt(0) !== '[' ? '.' : '')
                                    );
                                } catch (ex) {}
                                return prop !== undefined ? prop : str;
                            });
                    }
                }
            });

            console.log('china\\\'s capital');

            $('#filter1 .text1').text().should
                .equal('china\'s capital is Beijing');
            $('#filter1 .text2').text().should
                .equal('china\'s capital is Beijing');
        });
    });

    after(function () {
        document.body.removeChild(div);
    });
};
