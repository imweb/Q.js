Q.js
====

> 模仿Vuejs的`伪MVVM`库，下面是使用说明

一个简单例子
------------

模版：
```template
<a href="javascript:void(0)" q-text="msg"></a>
```

脚本：
```js
var vm = new Q({
    el: '#demo',
    data: {
        msg: 'hello'
    }
});
```

则会展示：

```
<a href="javascript:void(0)">hello</a>
```

当使用.data方法修改data时候会触发节点数据修改：

```
// 得到msg数据的处理方法
vm.data('msg')
    // 设置值为"你好"
    .set('你好');
```

则会展示：

```
<a href="javascript:void(0)">你好</a>
```

基本概念
--------

### directive

告知`libaray`如何对节点进行操作，遵循Vuejs写法：

```
<element
  prefix-directiveId="[argument:] expression [| filters...]">
</element>
```

简单例子：

```
<div q-text="message"></div>
```

这里表示`message`对应的数据，用`text`指令进行操作，`text`指令是在该节点塞入文字。

### 自定义`directive`

举一个我们在todoMVC的例子：

```
<input q-todo-focus="editing" />
```

则表示`editing`对应的数据变化时执行`todo-focus`指令，看看我们`todo-focus`指令怎么写的：

```
directives: {
    'todo-focus': function (value, options) {
        // 如果editing的值为false，则不处理
        if (!value) {
            return;
        }
        // 为true则，对该节点focus()一下
        var el = options.node;
        setTimeout(function () {
            el.focus();
        }, 0);
    }
}
```

### 通用`directive`

> 目前只提供了极少的通用`directive`，未来可拓展

* show - 显示与否
* class - 是否添加class
* value - 改变值
* text - 插入文本
* repeat - 重复节点
* on - 事件绑定
* model - 双向绑定（只支持input、textarea）

### filter

> 如果设置了`filter`，则绑定的数据会经过`filter`才执行对应的`directive`，这是我们可以在塞入数据前做输出处理，或事件触发前做数据处理。

模版：
```
<input q-model="msg" q-on="keyup: showMsg | key enter" />
```

`key`是其中一个通用filter，基本实现是：

```
var keyCodes = {
        enter    : 13,
        tab      : 9,
        'delete' : 46,
        up       : 38,
        left     : 37,
        right    : 39,
        down     : 40,
        esc      : 27
    };

/**
 * A special filter that takes a handler function,
 * wraps it so it only gets triggered on specific
 * keypresses. v-on only.
 *
 * @param {String} key
 */
function key(handler, key) {
    if (!handler) return;
    var code = keyCodes[key];
    if (!code) {
        code = parseInt(key, 10);
    }
    return function (e) {
        if (e.keyCode === code) {
            return handler.call(this, e);
        }
    };
}
```

则，当keyup发生，keyCode为13(即enter)时候，才会触发showMsg方法。

### method

> 特制`on`指令会调用的方法，例如：上面讲到的showMsg。

设置方法：

```
var vm = new Q({
    el: '#demo',
    data: {
        msg: 'hello'
    },
    methods: {
        showMsg: function () {
            alert(this.data('msg').get());
        }
    }
});
```

则那个input框会在初始化时自动设值为hello，当改变时候`msg`值也会改变，当按下`回车键`，则会触发showMsg方法打印值。

### data

> 所有data的设置操作都应该使用提供的方法来完成，我们提供了`$set`, `$push`, `$pop`, `$unshift`, `$shift`, `$touch`。

* 获取值

> 直接在vm上去就好，例如：
> vm.list[1]

* 赋值

> 必须使用$set方法赋值，例如：
> vm.list[1].$set('title', 'hello');

* 数组方法

> 目前支持的数组方法有：push, pop, unshift, shift, indexOf,


优化性能对比
----------

* 未优化前

Q.js#repeat x 7.83 ops/sec ±5.34% (34 runs sampled)
template#render x 30.13 ops/sec ±9.34% (55 runs sampled)

* parse缓存化

Q.js#repeat x 10.31 ops/sec ±3.40% (40 runs sampled)
repeat.js:50 template#render x 27.40 ops/sec ±1.38% (40 runs sampled)
