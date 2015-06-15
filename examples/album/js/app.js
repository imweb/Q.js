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
                var value = prompt('填写一个图片地址', 'http://pub.idqqimg.com/pc/misc/connect/files/20140424/e934597ca2314d8da4f3dbe67d41f80d.png');
                if (value) {

                    if (listVm.albums.length === 2) {
                        var d = new Date;
                        listVm.albums.unshift({
                            date: [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-'),
                            des: '反正就是游玩',
                            author: '你',
                            pics: [{
                                url: value
                            }]
                        });
                    } else {
                        listVm.albums[0].pics.push({
                            url: value
                        });
                    }
                    if (listVm.albums.length < 3) {
                        return alert('你已经删除掉创建的相册!');
                    }

                }
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
