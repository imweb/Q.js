!function (list) {

    var mode = 'c';
    // album list vm
    var listVm = list();
    // manage tool vm
    var toolVm;


    if (mode === 'b') {
        initB();
    } else if (mode === 'c') {
        initC();
    }

    function initB() {
        // TODO
    }

    function initC() {
        // set way to deal with images
        listVm.$set('dealImg', 'select');

        toolVm = new Q({
            el: '#manage-tool-mod',
            data: {
                isShow: true
            },
            methods: {
                'delete': function () {
                    var imgs = listVm.getSelectedImgs();
                    console.log('delete', imgs);
                    imgs.forEach(function (img) {
                        var arr = img._up;
                        arr.splice(arr.indexOf(img), 1);
                    });
                    imgs.length = 0;
                },
                cancel: function () {
                    var imgs = listVm.getSelectedImgs();
                    console.log('cancel', imgs);
                    imgs.forEach(function (img) {
                        img.$set('selected', false);
                    });
                    imgs.length = 0;
                }
            }
        });
    }
}(albumList);
