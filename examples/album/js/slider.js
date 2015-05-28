!function (Q, root) {

    function init() {
        return vm = new Q({
            el: '#slider-mod',
            data: {
                images: []
            },
            filters: {
                hasLength: function (value) {
                    return !!value.length;
                }
            },
            methods: {
                close: function () {
                    this.$set('images', []);
                }
            }
        });
    }

    root['slider'] = init;
}(Q, window);
