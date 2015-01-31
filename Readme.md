Q.js
====

[![Build Status](https://travis-ci.org/miniflycn/Q.js.svg?branch=master)](https://travis-ci.org/miniflycn/Q.js)

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
vm.$set('msg', '你好');
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
    'todo-focus': function (value) {
        // 如果editing的值为false，则不处理
        if (!value) {
            return;
        }
        // 为true则，对该节点focus()一下
        var el = this.el;
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
* vm - 创建子VM

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
            alert(this.msg);
        }
    }
});
```

则那个input框会在初始化时自动设值为hello，当改变时候`msg`值也会改变，当按下`回车键`，则会触发showMsg方法打印值。

### data

> 大部分操作都和对象与数组的操作相同，只有当设置值的时候需要使用`.$set`方法，因为我们没有defineProperty的支持。

* 得到一个msg的值：

```javascript
vm.msg
```

* 设置msg的值

```javascript
vm.$set('msg', obj);
```

* 对于数组可使用大部分数组方法，目前已经支持了：`push`、`pop`、`unshift`、`shift`、`indexOf`、`splice`、`forEach`、`filter`
