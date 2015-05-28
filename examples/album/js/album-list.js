!function (Q, slider, root) {
    var vm, selected = [];

    slider = slider();

    function showPic(value) {
        slider.$set('images', value.$up());
    }

    function selectPic(value) {
        value.$set('selected', !value.selected);
        if (value.selected) {
            selected.push(value);
        } else {
            selected.splice(selected.indexOf(value), 1);
        }
    }

    function init() {
        return vm = new Q({
            el: '#album-list-mod',
            data: {
                isShow: false,
                dealImg: 'show',
                albums: [
                    {
                        date: '2015-05-07',
                        des: '深圳湾红树林骑车一日游',
                        author: '飞翔的企鹅',
                        pics: [
                            {
                                url: 'http://p.qlogo.cn/gh/342323923/342323923/0'
                            },
                            {
                                url: 'http://pub.idqqimg.com/pc/misc/connect/files/20140424/e934597ca2314d8da4f3dbe67d41f80d.png'
                            },
                            {
                                url: 'http://p.qpic.cn/qqcourse/QFzQYCgCrxmtIj1Mk65nq9ibYMibU3Y4p2aLe3Nzo72ZPxicib0z6bFp4zFZ0NkFu6Bu/'
                            },
                            {
                                url: 'http://t3.qlogo.cn/mbloghead/157a5b12f45a8d325e36/0'
                            }
                        ]
                    },
                    {
                        date: '2015-05-01',
                        des: '深圳湾红树林骑车一日游',
                        author: '飞翔的企鹅',
                        pics: [
                            {
                                url: 'http://p.qlogo.cn/gh/342323923/342323923/0'
                            },
                            {
                                url: 'http://pub.idqqimg.com/pc/misc/connect/files/20140424/e934597ca2314d8da4f3dbe67d41f80d.png'
                            },
                            {
                                url: 'http://p.qpic.cn/qqcourse/QFzQYCgCrxmtIj1Mk65nq9ibYMibU3Y4p2aLe3Nzo72ZPxicib0z6bFp4zFZ0NkFu6Bu/'
                            },
                            {
                                url: 'http://t3.qlogo.cn/mbloghead/157a5b12f45a8d325e36/0'
                            },
                            {
                                url: 'http://p.qlogo.cn/gh/342323923/342323923/0'
                            },
                            {
                                url: 'http://pub.idqqimg.com/pc/misc/connect/files/20140424/e934597ca2314d8da4f3dbe67d41f80d.png'
                            },
                            {
                                url: 'http://p.qpic.cn/qqcourse/QFzQYCgCrxmtIj1Mk65nq9ibYMibU3Y4p2aLe3Nzo72ZPxicib0z6bFp4zFZ0NkFu6Bu/'
                            },
                            {
                                url: 'http://t3.qlogo.cn/mbloghead/157a5b12f45a8d325e36/0'
                            }
                        ]
                    }
                ]
            },
            filters: {
                whoUpload: function (value) {
                    return value + '上传';
                },
                hasLength: function (value) {
                    return !!value.length;
                }
            },
            methods: {
                dealPic: function (value) {
                    switch (this.dealImg) {
                        case 'show':
                            showPic(value);
                            break;
                        case 'select':
                            selectPic(value);
                            break;
                    }
                },
                getSelectedImgs: function () {
                    return selected;
                }
            },
            ready: function () {
                var self = this;
                self.$watch('albums', function (value) {
                    if (value.length && !self.isShow) {
                        setTimeout(function () {
                            self.$set('isShow', true);
                        }, 50);
                    }
                }, true, true);
            }
        });
    }

    root['albumList'] = init;
}(Q, slider, window);
