## 作用域

#### 作用域

定义：程序中定义变量的区域

#### 词法作用域

JavaScript 采用的就是词法作用域。词法作用域又称为静态作用域。
词法作用域的特点：作用域在函数声明时就已经确定（作用域基于函数创建时的位置），它与函数在何处调用无关。

#### 动态作用域

特点：作用域在函数调用时确定
采用动态作用域的语言：bash

#### 作用域链

JavaScript 每一个代码块（如函数）在执行前都会进行一些准备工作，而这个准备工作我们把它叫做执行上下文。
执行上下文中存在：

- AO（activite object 存放代码块中的变量）
- 代码块（函数）作用域链 `[[scope]]`
- This

```js
function foo() {
    function bar() {
         ...
    }
    bar()
}

foo()

/**
解析 bar 函数执行前的准备工作（执行上下文）
1. foo 执行
2. bar 完成声明（由于 JavaScript 是词法作用域，bar 的作用域在此时就被确定下来）
3. bar[[scope]] = [foo.AO, GO] （GO：全局变量，也可以称为全局作用域；AO：函数执行时内部作用域）
4. bar 执行 bar[[scope]] = [bar.AO, foo.AO, GO]
*/
```

**总结**：我们可以发现一个函数执行时访问变量首先会从当前函数的 AO 上找，然后是他的父级作用域，直到全局作用域。这种依次向上找形成链条我们便称其为作用域链。

## 闭包

定义：能够访问其他函数内部变量的函数，我们称其为闭包。
从作用域的角度理解闭包

```js
function foo() {
  const name = 'hehe'

  return function () {
    console.log(name)
  }
}

const sayName = foo()
sayName()

/**
1. foo 执行，生产执行上下文 fooContext = { AO, this, [[scope]] }
2. 返回匿名函数，由于词法作用域，函数作用域声明时被确定 [[scope]] = [foo.AO, GO]
3. sayName 执行，产生执行上下文 sayName = { AO, this, [[scope]]: [sayName.AO, foo.AO, GO] }
4. 打印 name。去 [[scope]] 中依次查找 name 变量。sayName.AO => foo.AO => GO
5. 打印 name = 'hehe'
*/
```

**总结**：通过执行上下文中的作用域链，我们可以发现闭包的产生就是由于函数的作用域链中持有了父函数的 AO（活动对象）。使得该函数可以访问到父函数（词法层面上的父函数）中的内部变量

## this

当前函数的执行环境

- 全局作用域下的 this（指向宿主环境）
- 对象方法中的 this（指向对象）
- 构造函数中的 this（指向示例）
- call、apply、bind 中的 this（指向实参）
- 箭头函数没有 this，它的 this 来源于词法作用域。

#### call 方法的实现

```js
function myCall(context, ...arg) {
  context = context || window
  context.fn = this
  const result = context.fn(...arg)
  delete context.fn
  return result
}
```

#### apply 方法实现

```js
function myApply(content, arg) {
  context = context || window
  context.fn = this
  const result = context.fn(...arg)
  delete context.fn
  return result
}
```

#### bind 方法的实现

```js
function myBind(context, ...outArgs) {
  return (...innerArgs) => this.myCall(context, ...outArgs.concat(innerArgs))
}
```
