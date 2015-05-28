!function (list) {

    // album list vm
    var listVm = list();
    // manage tool vm
    var toolVm;


    init();

    function init() {
        var DEFAULT_BUTTONS = [
            {
                text: '上传图片',
                type: 'upload'
            },
            {
                text: '批量管理',
                type: 'manage'
            }
        ]

        var methods = {
            upload: function () {
                alert('跳换上传页');
            },
            manage: function () {
                // set way to deal with images
                listVm.$set('dealImg', 'select');
                toolVm.$set('buttons', [
                    {
                        text: '删除',
                        type: 'delete'
                    },
                    {
                        text: '取消',
                        type: 'cancel'
                    }
                ]);
            },
            'delete': function () {
                var imgs = listVm.getSelectedImgs();
                imgs.forEach(function (img) {
                    var arr = img._up;
                    arr.splice(arr.indexOf(img), 1);
                });
                imgs.length = 0;
                reset();
            },
            cancel: function () {
                var imgs = listVm.getSelectedImgs();
                imgs.forEach(function (img) {
                    img.$set('selected', false);
                });
                imgs.length = 0;
                reset();
            }
        }

        function reset() {
            toolVm.$set('buttons', DEFAULT_BUTTONS);
            listVm.$set('dealImg', 'show');
        }

        toolVm = new Q({
            el: '#manage-tool-mod',
            data: {
                isShow: true,
                buttons: DEFAULT_BUTTONS
            },
            methods: {
                todo: function (data) {
                    methods[data.type]();
                }
            }
        });
    }
}(albumList);
