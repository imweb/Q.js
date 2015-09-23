本文希望通过20个简单的例子让没用过Q.js的同学快速掌握其基本用法

## 1. 新建实例
html代码：

	<div id="demo" q-text="msg"></div>
	
js代码：
	
	var q = new Q({
		el: "#demo",
		data: {
			msg: 'this is a demo'
		}
	})
[try](http://codepen.io/kuangwk/pen/pJqqaX?editors=101)

Q.js是一个mvvm框架，可以通过构造函数Q new 一个viewModel的实例，其传入的参数el即要绑定的view，可以是selector也可以直接是dom元素，而第二个参数data即model，也就是数据对象。

## 2. 内容绑定： q-text, q-value
html:

	<div id="demo" >
		<p q-text="msg"></p>	
		<input q-value="name">
	</div>
js: 
	
	var q = new Q({
		el: '#demo',
		data: {
			msg: 'this is a demo',
			name: 'Jack'
		}
	})
[try](http://codepen.io/kuangwk/pen/LppxBv?editors=101)

本例子展示了Qjs的dom的内容与model进行绑定的方式。在html中添加`q-text`(对于input则是`q-value`)属性名，并将属性值与数据对象data中的key对应，该key对应的值就会在dom中显示。而当我们通过某种方式修改data中的属性值时，dom中内容也会自动更新。我们将`q-text`,`q-value`等称为directive。

## 3. 过滤器 filters
html:

	<div id="demo" >
	    <p q-text="msg|addJerry"></p>
		<p q-text="msg|addJerry|toUpper"></p>
        <p q-text="msg|toUpper|addJerry"></p>
	</div>
js: 
	
	var q = new Q({
		el: "#demo",
		data: {
			msg: 'Tom'
		},
		filters: {
			addJerry: function(v){
				return v + ' and Jerry!';
			},
			toUpper: function(v){
				return v.toUpperCase();
			}
		}
	})
[try](http://codepen.io/kuangwk/pen/yYYgZK?editors=101)

前一个例子是将绑定数据直接展示，但有时候我们需要对数据进行特定处理之后再展示，这时候要用到Qjs的filters。本例中第一个p的`q-text="msg|addJerry"`中的msg还是声明数据绑定，后面跟着的`|addJerry`意思是msg在view中显示之前，要经过addJerry的处理，并将其返回值作为最终结果显示。第二行的 `q-text="msg|addJerry|toUpper"` 是多个filter的情况，过程是这样的，msg初始化后者变化的时候，msg的值会作为参数传给函数addJerry，addJerry的返回值则会作为toUpperCase的参数，而toUpper返回值则用于更新视图。

## 4. filters 传参
html

    <div>
		<div id="demo" >
			<p q-text="msg|addFriend Lucy Tom|toUpper"></p>
		</div>	
	</div>
js

	var q = new Q({
		el: "#demo",
		data: {
			msg: 'Tom'
		},
		filters: {
			addFriend: function(v, friend1, friend2){
				return v + ' and ' + friend1 + ' and ' + friend2;
			},
			toUpper: function(v){
				return v.toUpperCase();
			}
		}
	})
[try](http://codepen.io/kuangwk/pen/VveKew?editors=101)

上面例子是filters加上参数的情况，filter与参数之间用空格分开，注意filters函数第一个参数还是默认为变化的属性值，第二个参数开始才是对应传入的字符串参数。**目前只支持给filters传入字符串参数**

## 5. 是否显示: q-if q-show
html

    <div id="demo" >
		<p q-show="flag">q-show</p>
		<p q-show="name|isTom">isTom</p>
		<p q-show="name|isJerry">isJerry</p>
		<p q-if="flag">q-if</p>
	</div>
js
	
	var q = new Q({
		el: "#demo",
		data: {
			flag: true,
			name: 'Tom'
		},
		filters: {
			isTom: function(v) {
				return v === 'Tom';
			},
			isJerry: function(v) {
				return v === "Jerry";
			}
		}
	})
上面说过，q-text,q-value等我们称为dierctive，用于对dom元素做不同的处理，而本例中介绍的是控制是否显示directive，q-show和q-if，这两个directive的相同点是，都是根据属性的值或者经过filters处理后返回值的true or false来控制dom是否显示，即上面第一个p元素flag为true时显示，false时隐藏，第二个p元素是name属性经过isTom过滤器后返回的值为true则显示，false则不显示；而两者区别是q-if如果是false的话，不会在dom中渲染，而q-show为false的话dom会渲染，只是display为none而已

## 6. 类名控制 q-class
html

	<div id="demo" >
		<p q-class='colorRed:name1|isTom' q-text=name1></p>
		<p q-class='colorRed:name2|isTom' q-text=name2></p>
	</div>	
js
    
    var q = new Q({
		el: "#demo",
		data: {
			name1: 'Tom',
			name2: 'Jerry'
		},
		filters: {
			isTom: function(v) {
				return v === 'Tom';
			}
		}
	})
css

    .colorRed {
	    color: red;
    }
[try](http://codepen.io/kuangwk/pen/KdVgNQ)

q-class是另一个directive，控制的是dom的class属性，例子的 `q-class='colorRed:name1|isTom'` 中colorRed是类名，name是绑定数据对象的属性，isTom是要经过的filter，整个的意思是当name变化的时候，name经过isTom这个filter返回的结果如果是true，则给dom添加colorRed的类名，如果是false则去掉这个类名。

## 7. 通用属性控制 q-attr
html

	<div id="demo" >
		<p q-attr="data:name|setData thisis_, id:uid|setId">打开控制台看元素属性</p>
	</div>	
js
    
    var q = new Q({
		el: "#demo",
		data: {
			name: 'Tom',
			uid: '312'
		},
		filters: {
			setData: function(v, pre){
				return pre + v;
			},
			setId: function(v){
				return 'id_' + v;
			}
		}
	})
[try](http://codepen.io/kuangwk/pen/KdVgGx?editors=101)

q-attr可以给dom添加特定的属性，上面例子中给p元素添加了data和id属性，`data:name|setData thisis_`中data是属性名，name是绑定的数据，setData是filter，thisis_是作为字符串传给setData的参数。最后p元素会有2个属性`data="thisis_Tom"`和`id="id_312"`

## 8. 循环控制 q-repeat
html
	
	<div id="demo" >
		<div q-repeat="members">
			<span q-text="name"></span> from
			<span q-text="from"></span>.
		</div>
	</div>
js
	
	var q = new Q({
		el: "#demo",
		data: {
			members: [{
				name: 'Tom',
				from: 'Guangzhou'
			},{
				name: 'Jerry',
				from: 'Beijing'
			},{
				name: 'Ben',
				from: 'HK'
			}]
		}
	})
[try](http://codepen.io/kuangwk/pen/dYGpLp?editors=101)

q-repeat是控制循环的directive，接受参数是数据对象中的数组属性，在dom遍历数组渲染页面的时候，***当前namespace就会进入数组***，就是比如要绑定数组内的name属性，只需`q-text="name"`即可，而不必`q-text="members.0.name"`。

## 9. 事件 q-on
html
	
	<div id="demo" >
		<p q-on="click: clickHandler(e)" q-text="msg"></p>
	</div>	
js

	var q = new Q({
		el: "#demo",
		data: {
			msg: 'Click on me!'
		},
		methods: {
			clickHandler: function(e) {
				alert(this.msg);
			}
		}
	})
[try](http://codepen.io/kuangwk/pen/xwZEow?editors=101)

q-on提供了事件绑定，`q-click: clickHandler(e)`中`click`是事件名，可以换成`mouseover`, `keyup` 等事件，clickHandler是事件处理函数名，与Q对象methods属性中的函数对应，可传入e(即event对象)作为参数。函数内部的this指向Q对象。

## 10. 暴露api 
html

	<div id="demo" >
		<p q-on="click: clickHandler(e)" q-text="msg"></p>
	</div>
js

	var q = new Q({
		el: "#demo",
		data: {
			msg: 'Click on me!',
			name: 'Tom'
		},
		methods: {
			clickHandler: function(e) {
				alert(this.msg);
			},
			// 暴露api
			getMessage: function() {
				return this.name;
			}
		}
	})

	alert(q.getMessage());	
[try](http://codepen.io/kuangwk/pen/gaPLYX?editors=101)

methods属性中处理可以添加事件处理函数之外，还可以暴露api，外部可以直接 `q.xxx()` 调用改方法。

## 11. 初始化后运行的函数 ready
html
	
	<div id="demo" >
		<p q-text="msg"></p>
	</div>
js

	var q = new Q({
		el: "#demo",
		data: {
			msg: 'this is a demo'
		},
		filters: {},
		methods: {},
		ready: function() {
			console.log('查看控制台', this);
		}
	})	
[try](http://codepen.io/kuangwk/pen/XmXNmJ?editors=101)

这个很好理解，就是在初始化完成之后运行的函数，函数内的this还是指向Q对象

## 12. Q实例属性总结
js
	
	var q = new Q({
		el: "#demo",
		data: {
		},
		filters: {
		},
		methods: {
		},
		ready: function() {
		}
	})
ok，来到这里，我们来总结目前我们new一个Q实例需要传入的参数，一共有5个，
 
* `el`: 要绑定的dom元素，可以是selector或者dom元素（注意不是jquery元素）
*  `data`: 数据对象，用于数据绑定 
*  `filters`: 过滤器，用于对数据做特定处理后返回结果
*  `methods`: 事件处理函数或者暴露的api
*  `ready`: 初始化后运行的函数

## 13. directive总结
demo1
	
	<element
  		prefix-directiveId="argument: expression| filters arguments">
	</element>
demo2	
	
	<p q-on="click:clickHandler">
demo3

	<p q-class="redBg:name|isRed blue">
demo4	
	
	<p q-attr="id:uid">
	
	
上面demo1是directive用法的总结，遵循的事Vuejs的写法。

* `prefix`是前缀，我们默认是`q`
* `directiveId`是具体的指令，比如`q-text`是innerText，`q-on`是事件绑定，
* `augument` 只会在directive为`q-on`, `q-class`和 `q-attr`时会用到，在demo2中的是`click`，代表事件名，demo3中是`redBg`，代表类名，在demo4中是`id`，代表是属性名
*  `expression` 在各个directive中都会用到，在一般directive中代表绑定数据对象中的属性，如demo3中的name，demo4中的uid，但在directive是`q-on`中则代表事件处理函数名，如demo2的clickHandler
* `filters` 是过滤器，对绑定的数据进行处理后返回，多个filter用`|` 分开，执行时会按顺序依次过滤
* `arguments` 是过滤器的参数，跟filters之间用空格分开，多个参数也是用空格分开，目前只支持传入字符串作为参数。***注意在Q实例的filters的函数中第一个参数是绑定的数据，第二个开始才是传入的参数***

## 14. $get, $set
html
	
	<div id="demo" >
		<p q-text="msg"></p>
		<p q-text='msg2'></p>
	</div>	
js
	
	var q = new Q({
		el: '#demo',
		data: {
			msg: 'this is a demo!',
			msg2: 'I am Tom',
			person: {
				name: 'Tom',
				age: '21'
			},
			group: ['a', 'b', 'c']
		},
		ready: function() {
			this.$set('msg2', 'You are Jerry');
		}		
	})	
    console.log(q.msg); // ->  'this is a demo!'
	console.log(q.person ,q.person.$get()); // -> [dirty object] ,Object {name: "Tom", age: "21"}
	console.log(q.group, q.group.$get()); // -> [dirty array], ["a", "b", "c"] 
[try](http://codepen.io/kuangwk/pen/wKMogY?editors=101)
	
要获取数据对象中的数据，可以直接通过q.xxx的方式获得，但要注意的如果要获取的属性是对象或者数组，q.xxx得到的是一个经过包裹的脏数据，要获取去包裹的对象或数组，则需通过 q.xxx.$get()。 而设置数据是通过 q.$set(key, value)，数据被设置更新后，会触发视图的更新，数据经过filters（如果有）过滤后返回的结果会根据不同的directive更新视图。比如上面例子的 `this.$set('msg2', 'You are Jerry')` 中msg2被设置改变了，会触发更新绑定了msg2的p元素的innerText。	

## 15. 作用域  $namespace $up
html

	<div id="demo" >
		<div q-repeat="people">
			<p q-text="name" q-on="click:nameClicked(this, e)"></p>
		</div>	
	</div>	
js

		
	var q = new Q({
		el: '#demo',
		data: {
			people: [{
				name: 'Jerry',
				age: 12
			},{
				name: 'Tom',
				age: 13
			},{
				name: 'Jack',
				age:15
			}]
		},
		methods: {
			nameClicked: function(current, e){
				console.log(current.$namespace()); // -> people.0（1，2）
				console.log(current.$up().$up() === this); // -> true
			}
		}
	})	
[try](http://codepen.io/kuangwk/pen/PPZbOd?editors=101)

本例子中要注意html中 `q-on="click:nameClicded(this, e)"` 中的this作为参数传给事件处理函数（目前事件处理函数只能传入2个参数，e 和 this），这里的this并不是外层的q对象，而是people数组中的每个对象。为了更好地理解，可以通过$namespace方法获取当前对象在整个Q对象中的位置，比如如果当前的namespance是`people.0`，则意味着可以通过q.people.0获得当前对象，而根据这个namespace，可以使用$up方法进行上溯，`current.$up()`即people对象，`current.$up().$up()`则是顶层q对象。

## 16. 数组操作
html

	<div id="demo" >
		<div q-repeat="people">
			<span q-text="name"></span>
			<button q-on="click:deletePerson(this, e)">删除</button>
		</div>	
		<div>
			<input type="text" />
			<button q-on="click:addPerson(e)">添加</button>
		</div>
		<button q-on="click:deleteLast">删除最后一个</button>
		<button q-on="click:clear">清空</button>
	</div>	

js

	var q = new Q({
		el: '#demo',
		data: {
			people: [{
				name: 'Jerry'
			},{
				name: 'Tom'
			},{
				name: 'Jack'
			}]
		},
		methods: {
			deletePerson: function(current, e){
				this.people.splice(current.$key(), 1);
			},
			deleteLast: function(){
				this.people.pop();
			},
			addPerson: function(e){
				var target = e.target;
				var input = target.previousSibling.previousSibling;
				var value = input.value;
				if (value) {
					this.people.push({name: value});
					input.value = '';
				} 
			},
			clear: function(){
				this.$set('people', []);
			}
		}
	})
[try](http://codepen.io/kuangwk/pen/LpGbeL?editors=101)

这是目前为止最复杂的例子，演示的是数据对象中数据的操作，也集成了前面例子说到的各种用法，基本看懂了这个例子就是对前面的例子的一个简单review了，里面用到比如事件，this引用，q-repeat，$set等。这里要注意的是当我们调用数据对象中的数组的方法对数组进行操作时，操作会直接影响视图（目前支持对数组操作并影响视图的方法有 `push`、`pop`、`unshift`、`shift`、`indexOf`、`splice`、`forEach`、`filter` ), 另外`this.$set('people', [])` 是常用的清空列表的方式。

## 17. 监听数据的变化  $watch
html
	
	<div id="demo" >
		  <p q-text="msg" q-on="click:clickHandler"></p>
	</div>	
js
	
	var vm = new Q({
		el: '#demo',
		data: {
			msg: 'Click on me!'
		},
		methods: {
			clickHandler: function () {
				this.$set('msg', 'data changed')
			}
		},
		ready: function(){
			this.$watch('msg', function(newVal, oldVal){
				console.log(newVal, oldVal);
			})
		}
	});
[try](http://codepen.io/kuangwk/pen/BojQYG?editors=101)

上面例子展示了我们可以通过$watch函数监听数据变化，当数据变化时会调用我们定义的回调函数，并将变化前后数据作为参数。

## 18. 自定义directive
html
	
	<div id="demo" >
		<span q-text='num'></span>
		<button q-on='click:addNum'>+</button>
		<div id='' q-setwidth='num' style='background:red;height:10px;width:10px'></div>
	</div>	
js
	
	var vm = new Q({
		el: '#demo',
		data: {
			num: 1
		},
		directives: {
			setwidth: function(value){
				this.el.style.width  = value * 10 + 'px';
			}
		},
		methods: {
			addNum: function() {
				this.$set('num', this.num + 1);
			}
		}
	});
[try](http://codepen.io/kuangwk/pen/bVEBvZ?editors=101)
	
前面的例子说过，directive是我们对dom属性进行不同的处理，而除了原生提供的dierctvie之外，我们还可以通过自定义directive来实现特定的处理，如上面例子中的`q-setwidth＝"num"`的意思就是说，等num数据变化时，就会运行directives属性中的setwidth函数，从而可以在函数中自定义一些处理。其实这个跟上一个例子的$watch有点像，都是监听数据变化运行指定函数，不同的是这里自定义directive的函数运行时的this指向不是最外层q对象，而是一个与当前dom相关的对象，这样更方便我们对当前dom进行操作，比如本例子中我们直接通过`this.el`即可获得当前div元素。

## 19. 零散而实用的东西 a.b & $top
html

	<div id="demo" >
		<p q-text='dog.name'></p>
		<li q-repeat='friends'>
			<span q-text='name'></span> is 
			<span q-text="$top.dog.name"></span>'s
			Friend
		</li>
	</div>	
js

	var vm = new Q({
		el: '#demo',
		data: {
			dog: {
				name: 'Kevin'
			},
			friends: [{
				name: 'Jerry'
			},{
				name: 'Tom'
			},{
				name: 'Mike'
			}]
		}
	});
[try](http://codepen.io/kuangwk/pen/bVEBjJ?editors=101)

上面例子展示了当数据结构相对比较复杂的时候我们绑定数据的方式，一个是当数据不在data的最外层属性的时候，我们可以通过a.b的方式绑定对象里层的数据。第二个是等我们进入了`q-repeat`循环的namespace时，我们通过$top.xx的方式获取数组外层属性，这里的$top指向最顶层的数据对象。***Tips: 注意比较旧的版本可能不支持这些用法***

## 20. 一个完整的例子凑够20个
html 

	<div id="demo" style="display:none">
		<h1 q-text="title"></h1>
		<input type="text" />
		<button q-on='click:addItem'>+</button>
		<ul>
			<li q-repeat='todos'>
				<input type="checkbox" q-attr='checked:isDone' q-on='click:checkItem(this, e)'/>
				<span q-text='text' q-middleline='isDone'></span>
				<button q-on="click:deleteItem(this)">-</button>
			</li>
		</ul>
	</div>
	<div id="loading">loading...</div>

js
	
	var vm = new Q({
		el: '#demo',
		data: {
			title: '简单的todos mvc',
			todos: [{
				text:'The world is big, I want to see see!',
				isDone: false
			}],
		},
		directives: {
			middleline: function(value){
				if (value) {
					$(this.el).css('text-decoration' ,'line-through');
				} else {
					$(this.el).css('text-decoration' ,'none');
				}
			}		
		},
		methods: {
			addItem: function(e) {
				var target = e.target
				var value = target.previousElementSibling.value;
				if (!value) return;
				this.todos.push({text: value, isDone: false});
				target.previousElementSibling.value = '';
			},
			checkItem: function(item, e) {
				item.$set('isDone', $(e.target).attr('checked'));
			},
			deleteItem: function(item) {
				this.todos.splice(item.$key(), 1);
			}
		},
		ready: function() {
			$(this.$el).show();
			$('#loading').hide();
		}
	});
[try](http://codepen.io/kuangwk/pen/avOxGv?editors=101)

end