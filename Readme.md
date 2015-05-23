Q.js
====

[![Build Status](https://travis-ci.org/miniflycn/Q.js.svg?branch=master)](https://travis-ci.org/miniflycn/Q.js)

> 模仿Vuejs的`伪MVVM`库，下面是使用说明

一个简单例子
------------

模版：
```template
<a id="demo" href="javascript:void(0)" q-text="msg"></a>
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

当使用.$set()方法修改data时候会触发节点数据修改：

```
vm.$set('msg', '你好');
```

则会展示：

```
<a href="javascript:void(0)">你好</a>
```

基本概念
--------

## The Q Constructor

> Q的构造函数是Q.js的核心。你能用它创建一个Q的实例：

```
var vm = new Q({ /* options */ });

```

## Options

### data

* 类型：`Object`

> 用于初始化Q对象元数据：

```
var data = {
    msg: 'hello'
};
var vm = new Q({
    data: data
})
vm.$options.data === data // -> true
```

> 大部分操作都和对象与数组的操作相同，只有当设置值的时候需要使用`.$set`方法，因为我们没有defineProperty的支持。

* 得到data中msg的值：

```javascript
vm.msg // -> hello
```

* 设置msg的值

```javascript
var obj = {
    msg: 'hello world!'
};
vm.$set('msg', obj.msg); // -> hello world!
```

* 对于数组可使用大部分数组方法，目前已经支持了：`push`、`pop`、`unshift`、`shift`、`indexOf`、`splice`、`forEach`、`filter`

### el

* 类型：`String | HTMLElement`

通过一个给定的DOM元素生成一个Q实例。可以是一个CSS选择器字符串，一个实际存在的HTML元素，最终会在`q.$el`中。

### directive

* 类型：Object

告知`libaray`如何对节点进行操作，遵循Vuejs写法：

```
<element>
  prefix-directiveId="[argument:] expression [| filters...]">
</element>
```

简单例子：

```
<div id="myText" q-text="message"></div>
```

Q.js中，默认的prefix是`q`，directiveId是`text`，expression是`message`。这个directive的作用是，当Q实例中`message`这一属性的值发生变化时，告知Q.js去更新这个节点的文本内容。这里表示`message`(key)对应的数据(value)，用`text`指令进行操作，`text`指令是在该节点塞入文字。例如：
```javascript
var myText = Q.get('#myText'); //Q.get():获取一个Q实例，遵循restful风格，如果不存在则创建一个，并把节点的dom信息
```

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

```
<div q-show="isShow">show!<div>
```
Q实例的data中`isShow`的布尔值决定了这个节点是否显示
```
data: {
    isShow: true;
}
```

* class - 是否添加class

```
<div q-class="active: isActive"></div>
```

```
data: {
    isActive: true;
}
```

* attr - 设置节点属性（attribute & property）

```
<img q-src="url">
```

```
data: {
    url: 'http://www.qxiu.com/2014/images/logo_qi.jpg'
}
```

* value - 改变值

用法与text类似，支持input等有value属性的标签

* text - 插入文本
* repeat - 重复节点

```
<li q-repeat="list">xxx</li>
```

```
data: {
    list: [];
}
```
* on - 事件绑定

```
<div q-on="click: showMsg"></div>
```
* model - 双向绑定（只支持input、textarea）
* vm - 创建子VM(ViewModel,一个Q对象的实例)

* if - 是否使用模版

对应值为false，模版将不被渲染，为true则渲染

```
<p q-if="need">hello world</p>
```

```
data: {
    need: true
}
```

### filter

> 如果设置了`filter`，则绑定的数据会经过`filter`才执行对应的`directive`，这是我们可以在塞入数据前做输出处理，或事件触发前做数据处理。

模版：
```
<input id="demo" q-model="msg" q-on="keyup: showMsg | key enter" />
```

`key`是其中一个通用filter，基本实现是：

```
var keyCodes = {
        enter    : 13,
        tab      : 9,
        'delete' : 46, // delete是关键字，需要用引号包起来
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
    if (!handler || key === undefined) return;
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
    filters: {
        key: key
    },
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

用户
----

[![齐齐互动视频](http://www.qxiu.com/2014/images/logo_qi.jpg)](http://www.qxiu.com/)

[![QQ群](http://qplus3.idqqimg.com/qun/portal/img/logo2.png)](http://qun.qq.com/)
