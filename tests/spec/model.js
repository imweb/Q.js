function simulateChange(el) {
  var evt;
  if (document.createEvent) {
    evt = document.createEvent('Event');
    evt.initEvent('propertychange', true, true);
    el.dispatchEvent(evt);
  } else if (el.fireEvent) {
    el.fireEvent('oninput');
  }
}

module.exports = function (Q) {
    var div;
    before(function () {
        div = document.createElement('div');
        div.innerHTML =
            '<input id="model1" q-model="obj.text">';
        document.body.appendChild(div);
    });

    describe('model', function () {
        it('should able to bind model with data', function () {
            var vm = new Q({
                el: '#model1',
                data: {
                    obj: {
                        text: 'hello'
                    }
                }
            });

            var $el = $('#model1')[0];
            $el.value.should.equal('hello');
            $el.value = 'hello tencent';
            simulateChange($el);
            vm.obj.text.should.equal('hello tencent');
        });
    });


    after(function () {
        document.body.removeChild(div);
    })
};
