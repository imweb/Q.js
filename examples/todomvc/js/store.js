(function (exports) {

    'use strict';

    var STORAGE_KEY = 'todos-quesjs';

    exports.storage = {
        fetch: function () {
            var res = []
            try {
                res = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            } catch(e) {
                return res;
            }
            return res;
        },
        save: function (todos) {
            window.JSON &&
                localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
        }
    };

})(window);
