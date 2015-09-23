Q.js
====

[![Build Status](https://travis-ci.org/imweb/Q.js.svg?branch=master)](https://travis-ci.org/imweb/Q.js)

> 模仿Vuejs的`伪MVVM`库，下面是使用说明

#Q.js  API

 
[TOC]


##Summary 概述
####Qjs 构造函数
Qjs 的构造函数是 Qjs 的核心。它允许你创建 Qjs 实例。创建一个 Qjs 实例非常简单：
``` javascript
var Qjs = require("lib/Q");
//创建一个Qvm
var vm = new Qjs({ /* options */ });
```
当你初始化一个Q实例时，你需要传递一个选项对象。这个对象可以包括目标 DOM 元素，初始 data 对象，method 方法，过滤器filters函数等内容。完整的选项列表详见 组件选项(`需要有一个跳转链接`)。
- 每个Qjs实例本质上就是一个**ViewModel** 。
- 每个实例都有一个对应的 DOM 节点 vm.\$el，它大致相当于 MVVM 中的 **V**。
- 每个实例也有一个 JavaScript 数据对象 vm.\$data，相对应的就是 MVVM 中的 **M**。

改变 M 会触发 V 的更新。对于双向绑定，用户在 V 当中触发的事件会导致 M 的状态变化。
Qjs 实例上暴露的全部属性详见 实例属性(`需要有一个跳转链接`)。

##Options 组件选项
###小栗子 demo
```javascript
var vm = new Q({
	el:"#id" //selector
    data: {},
    methods:{
	    method1:function(){}
    }
    filters:{}
    direcitves:{}
})
```

### data
类型：`Object`
Q实例的数据对象，可以通过`vm.$options.data`访问：
```
var data = {
    msg: 'hello'
};
var vm = new Q({
    data: data
})
vm.$options.data === data // -> true
```
 大部分操作都和对象与数组的操作相同，只有当设置值的时候需要使用`.$set`方法，因为我们没有defineProperty的支持。

 得到data中msg的值：

```javascript
vm.msg // -> hello
```

设置msg的值

```javascript
var obj = {
    msg: 'hello world!'
};
vm.$set('msg', obj.msg); // -> 'hello world!'
```
得到data相对于vm的namespace:

```javascript
var data = {
    msgs: [
        {
            text: 'hello'
        },
        {
            text: 'tencent'
        }
    ]
};
var vm = new Q({
    data: data
})
vm.msgs[0].$namespace(); // -> 'msgs.0'
```

如果data是obj，得到其在父级的key:

```javascript
vm.msgs[0].$key(); // -> 0
```

如果data是obj，得到其父级:

```javascript
vm.msgs[0].$up(); // -> vm.msgs
```

> 对于数组可使用大部分数组方法，目前已经支持了：`push`、`pop`、`unshift`、`shift`、`indexOf`、`splice`、`forEach`、`filter`，其中`push`、`splice`在`repeat` directive中做了适当的优化，使得使用这两个方法，只会导致repeat的局部渲染。

### el

类型：`String | HTMLElement`

通过一个给定的DOM元素生成一个Q实例。可以是一个CSS选择器字符串，一个实际存在的HTML元素，最终会在`q.$el`中。

### directive

类型：Object

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
var myText = Q.get('#myText'); // Q.get():获取一个Q实例，遵循restful风格，如果不存在则创建一个，并把节点的dom信息
```

##
## 自定义`directive`

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

#### 通用`directive`

> 目前只提供基本的通用`directive`，可拓展 

#####\#q-text 
- 更新元素的 `textContent`。
- 常用于文字节点上。
``` html
<span q-text="variableName"></span>
```

#####\#q-html 
- 更新元素的 `innerHTML`。
- 将 q-html 绑定到用户提供的数据上会有 XSS 的风险，因此使用 v-html 时应确保数据的安全性，或通过自定义过滤器将不被信任的 HTML 内容进行预处理
``` html
<div q-html="variableName"></div>
```
#####\#q-show 
- 根据绑定值决定是否显示元素。
``` html
<div q-show="isShow">show!<div> 
<!-- 根据isShow绑定值决定是否显示 --->
```
Q实例的data中`isShow`的布尔值决定了这个节点是否显示
```
var vm = new Qjs({
	data:{
		isShow ： isSHow
	}
})
```
#####\#q-attr 
设置节点属性（attribute & property）

```
<img q-attr="src: url">
```

```
data: {
    url: 'http://www.qxiu.com/2014/images/logo_qi.jpg'
}
```
#####\#q-value - 改变值

用法与text类似，支持input等有value属性的标签


#####\#q-class
- 接受一个可选的参数
如果没有提供参数，则将绑定值作为 CSS 类命字符串添加到元素的 classList 中。
如果提供了参数，则会以参数为 CSS 类名，并根据绑定值的真伪进行增添去除。可以配合多重从句使用：
``` html
<span q-class="
  success : isWork,
  isOpen  : open,
  hidden  : isHidden
"></span>
```
```
data: {
    isWord : isW,
    isOpen : isO,
    isHidden : isH
}
```



#####\#q-repeat - 重复节点

```
<li q-repeat="list"></li>
```

```
data: {
    list: [];
}
```
#####\#q-on
- 需要一个参数。
- 绑定值应该是一个函数或者声明。
- 为元素添加一个 DOM 事件监听器。事件的类型由参数指定。这也是唯一可以和 key 过滤器一起使用的指令。详细请见事件监听。
``` html
<div q-on="click: showMsg"></div>
```


#####\#q-model 
- 双向绑定（只支持input、textarea）

#####\#q-vm 
- 创建子VM(ViewModel, 一个Q对象的实例)，
例如：

```
<b>
    <c q-vm="d"></c>
</b>
```

则c节点会绑定一个d component的实例，d component需要事先定义(Ques自动集成了该过程)，例如：

```
Q.define('d', {
    data: {},
    methods: {},
    filters: {},
    directives: {}
});
```

#####\#q-ref 
- 创建子VM在父级嵌套VM中的引用，例如：

```
<b>
    <c q-vm="c" q-ref="c"></c>
</b>
```
表示，如果b是b component的VM实例，则`b.$.c`可以引用到c component的VM实例

#####\#q-with
 - 创建子VM在父级嵌套VM中对应的数据，例如：

```
<b>
    <c q-vm="c" q-with="xxx"></c>
</b>
```

表示c component的VM实例对应的data是`b.xxx`



#####\#q-if 
- 是否使用模版
- 对应值为false，模版将不被渲染，为true则渲染

```
<p q-if="need">hello world</p>
```

```
data: {
    need: true
}
```

##### \#filter  过滤器
使用格式： `target | filterName [args..]`
- 如果设置了`filter`，则绑定的数据会经过`filter`才执行对应的`directive`，这是我们可以在塞入数据前做输出处理，或事件触发前做数据处理，相当于shell脚步的管道。

q-on="xx: method" e
q-on="xx: method(e, this3)"

模版：
```
<input id="demo" q-class="hide: isStart | ! " q-on="keyup: showMsg | key enter" />
```
该例子有两个过滤器，分别
- 过滤器 `!` 
- 过滤器 `key`

`！`是设置在vm实例上的filters，基本实现是：
```javscript
var vm = new Qjs({
	filters:{
		'!' : function(v){   //这里的参数v即 isStart
		     return  !v;
		}
	}
})
	
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
```
<input id="demo" q-class="hide: isStart | ! " q-on="keyup: showMsg | key enter" />
```
设置methods方法：

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

则那个input框会在初始化时自动设值为hello，当改变时候`msg`值也会改变，当按下`回车键`，则会触发showMsg方法alert值。



## Data 对象
在Qjs中，定义了一个Data对象
 Data对象是其中一个十分重要的基础对象（类）（`可以理解为父类或基类`）

###Data Prototype原型


###\#data.$key
获取KEYS
###\#data.$up
获取上一级对象
```
//如 存在 a.b.c这样的关系对象
 b.$up // a
```
###\#data.$set( key, value )
设置属性key的值


##Q实例 （VM）

由于Q实例继承了`Data对象`
``` javascript
	 _.extend(Q.prototype, Data.prototype); //将Data的原型加入了Q的原型对象上
```
故其也有相应的 \$set, \$get, \$change, \$up, \$namespace的方法

###实例属性：
####\#vm.$el
返回类型：`[HtmlElemt]`
返回当前Q 实例绑定的 DOM 元素。

####\#vm.$options
返回类型：`[obejct]`
返回当前Qjs实例所使用的实例化选项。如果你想要调用自定义选项，就会需要用到这个
```javascript
var Qjs = require("Q");
new Qjs({
  appType: 'ios',        //自定义的属性appType
  methods:{ 
	  getAppType:function () {
               console.log(this.$options.appType) // -> 'ios'
      }}
})
```
####\#vm.data
返回类型：`[obejct]`
返回当前Qjs实例正在监视的数据对象 (data object)。你可以用新的对象去替换它。Qjs实例会代理其 data 对象上的所有属性。

####\#vm.$parent
返回类型：`[vm]`
返回当前 vm 的父实例（如果存在的话）。

####\#vm.children
返回类型：`[Array[vm]]`
返回当前实例的直接子实例数组。


####\#vm.dataName /  vm.methodName  
[data / method]

###实例方法：

####\#vm.$set( key, value )
继承Data对象的$set 
####\#vm.$get
继承Data对象的$get

####\#vm.$emit( event , [args...])
参数event:：`[String]`
参数arg:：`事件函数所需的额外参数`  **可选（optiional）**  
在当前 vm 上触发一个事件。
```javascript
//目前支持两种事件emit调用方式：
//1、参数为事件名称--直接触发该VM事件event
vm.$emit("eventName",[args..]);
//2、参数为"data:XXX"  触发datachange事件
vm.$on("datachange", function(target, [args..]){
	console.log(target); //dataName [string]
	//返回的是字符串-数据名
}); 
vm.$emit("data:dataName", [args..]);
```

####\#vm.$on( event,  callback )
参数event ： `[String]`
参数callback： `[Function]`
在当前 vm 上监听一个事件。
```javascript
vm.$on('applyFinished', function () {
     //do something;
});      
```
####\#vm.$once（event, callback）
参数event ： `[String]` 
参数callback： `[Function]` 
在当前 vm 上监听一个一次性的事件。
```javascript
vm.$off('onceEvent', function () {
     //do something;
});      
```
####\#vm.$off([event, callback])
参数event ： `[String]` **可选（optiional）**
参数callback： `[Function]` **可选（optiional）**
如果没有传递参数，那么将会将所有事件监听去除；
如果传递了一个事件，那么移除该事件的所有回调；
如果事件和回调都被传递，则只移除该回调。
```javascript
vm.$off('touchApple',  callback1);      
// callback1 是事件touchApple绑定的函数
```

####\#vm.$watch


##自定义指令/过滤器
故下面讲解下如何创建**Common Directive** 和**Private Directive**
故下面讲解下如何创建**Common Filter** 和**Private Filter**





# 入门教程
[20个例子入门qjs](https://github.com/imweb/Q.js/blob/master/doc/tutorial.md)



用户
----

[![齐齐互动视频](http://www.qxiu.com/2014/images/logo_qi.jpg)](http://www.qxiu.com/)

[![QQ群](http://qplus3.idqqimg.com/qun/portal/img/logo2.png)](http://qun.qq.com/)

[![家校群](https://cloud.githubusercontent.com/assets/2239584/7838577/283888ca-04c0-11e5-98a2-adc49360eb2a.png)](http://qun.qq.com/homework/)

## License
(The MIT License)

Copyright (c) 2014-2015 Daniel Yang <miniflycn@justany.net>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
