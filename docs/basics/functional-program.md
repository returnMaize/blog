## 常见的编程范式

- 面向过程编程范式
- 面向对象编程范式
- 函数式编程范式

这里我们只讨论函数式编程范式，说到函数式编程范式。就绕不开纯函数。

## 纯函数

**相同的输入有相同的输出，且没有副作用**

相同的输入有相同的输出

```javascript
// 正例
const add1 = (a, b) => a + b

// 反例
let a = 1
const add2 = (b) => a + b
// add2 函数返回值会随着我们调用次数的变化而变化（哪怕 b 始终为同一个值）
```

没有副作用

```javascript
// 正例
const map1 = (arr, fn) => {
  const res = []
  for (let i = 0; i < arr.length; i++) {
    res.push(fn(arr[i]))
  }
  return res
}

// 反例
const map2 = (arr, fn) => {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = fn(arr[i])
  }
  return arr
}
// map1 和 map2 函数作用都是用来映射数组的每一项，不同的是 map2 会污染数据源。而 map1 函数是返回一个全新的数组。我们把这种会污染数据的行为就叫做副作用。
```

了解了什么是纯函数，下面我们就开始我们的函数式编程了。

## 函数式编程

**把现实世界事物间的联系抽象到程序世界中来**

举个非常常见的例子，我们需要访问一个数组中的所有元素。

```javascript
// 这是不使用函数式编程的方式（也可以说面向过程编程）
const arr = [1, 2, 3]
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i])
}

// 使用函数式编程抽象“访问数组中所有元素”的这个行为
const arr = [1, 2, 3]
const each = (arr, fn) => {
  for (let i = 0; i < arr.length; i++) {
    fn(arr[i])
  }
}
each(arr, (item) => console.log(item))
// 这里的 each 函数就是我们对 “访问数组中所有元素” 这个行为的抽象
```

通过上面的例子，我们可以直观的感受到函数式编程带来的一些好处

- 可读性较高（每个函数都是对行为的抽象）
- 方便测试和定位问题（程序一出现问题，我们只需要关注对应的函数）
- 高复用性
- 安全性（由于函数式编程都是纯函数，没有副作用。使得写出来的程序非常稳定安全）

除此之外，函数式编程还有我个人觉得非常牛的能力。就是它的缓存。因为函数式的编程都是纯函数，相同的输入必定是相同的输出。这就使得我们可以对函数的返回进行缓存，下次该函数再次执行时，我们便可以直接命中缓存，无需做重复的计算。（举个例子）

```javascript
// 求和函数
const sum = (a, b) => {
  return a + b
}

// 缓存函数计算结果
const memorize = (fn) => {
  const cache = {}
  return function (...arg) {
    const key = fn.name + JSON.stringify(arg)
    cache[key] = cache[key] || fn(...arg)
    return cache[key]
  }
}

// 生成带缓存的求和函数
const getSumMemorize = memorize(add)

// getSumMemorize 函数内部只会计算一次，之后都命中缓存
getSumMemorize(1, 2)
getSumMemorize(1, 2)
getSumMemorize(1, 2)
getSumMemorize(1, 2)
```

可以很直观的感觉到缓存带来的好处。并且这个优点会随着计算内容的变多而无限被放大。而且我们可以试着想象一下，如果我们需要开发一个第三方的工具库。这是我们采用函数式编程，且我们将所有的方法都包上一层 memorize 函数。这样我们的库里的方法就出厂自带缓存了哈哈哈。

最后再浅谈一下高阶函数和函数柯里化（函数式编程必备）

## 高阶函数

- 函数作为参数（又称回调函数）

```javascript
// 这里我们通过函数作为参数的方式抽象了“数组遍历”这一行为
const each = (arr, fn) => {
  for (let i = 0; i < arr.length; i++) {
    fn(arr[i])
  }
}
// 通过这类高阶函数我们能抽象出一个具体行为（例如下面的一些函数）
Array.prototype.map // 映射数组每一项元素
Array.prototype.every // 检测数组是否每一项都符合某个条件
Array.prototype.some // 检测数组中是否存在符合条件的元素项
...
```

- 函数作为返回值

```javascript
// 生成计算数的次方的函数
const makePow = (powNum) => {
  return (num) => Math.pow(num, powNum)
}

// 计算数的 2 次方
const pow2 = makePow(2)
// 计算数的 3 次方
const pow3 = makePow(3)

// 4, 8
console.log(pow2(2), pow3(2))
// 通过这类高阶函数我们可以生产出对应功能的函数
```

其实 makePow 这类函数又称为函数的柯里化

## 函数柯里化

**将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术**

```javascript
// 求和函数
const sum = (a, b, c, d) => {
  return a + b + c + d
}

// 函数柯里化
function curry(fn) {
  return function curryFn(...arg) {
    if (arg.length < fn.length) {
      return function () {
        return curryFn(...arg.concat(Array.from(arguments)))
      }
    }
    return fn(...arg)
  }
}

// 柯里化求和函数
const sumCurry = curry(sum)

// 可以随意接受参数 直到所有参数集齐执行 sum 函数
console.log(sumCurry(1)(2)(3)(4))
console.log(sumCurry(1, 2)(3, 4))
console.log(sumCurry(1, 2, 3, 4))
console.log(sumCurry(1), (2, 3, 4))
```

好了，今天就到这里了。关于函数式编程还有很多其他内容。之后会一一更新，今天就先到这里了。
