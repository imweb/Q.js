var _ = require('./utils');

module.exports = {
    show: function (value, options) {
        var node = options.node;
        if (value) node.style.display = 'block';
        else node.style.display = 'none';
    },
    'class': function (value, options) {
        var node = options.node,
            event = options.event;
        value ?
            _.addClass(node, event) :
            _.removeClass(node, event);
    },
    value: function (value, options) {
        var node = options.node;
        if (node.type === 'checkbox') {
            node.checked = value;
        } else {
            node.value = value;
        }
    },
    text: function (value, options) {
        options.node.innerText = value;
    }
};
