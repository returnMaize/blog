## 深入理解 JS 中的对象

> ECMA-262 第 5 版在定义只有内部才用的特性（attribute）时，描述了属性（property）的各种特征。 ECMA-262
> 定义这些特性是为了实现 JavaScript 引擎用的，因此在 JavaScript 中不能直接访问它们。为了
> 表示特性是内部值，该规范把它们放在了两对儿方括号中，例如[[Enumerable]]。

以上是《红宝书》的原话。意思就是 ECMAScript 给对象属性定义了一些特性了，这些特性用来描述对象属性的特征。而这些特性是给 js 引擎用的，在 js 中不能直接访问，并且为了凸显这是内部值，把他们放到了双中括号中。

而 JS 中的对象中的属性其实分为两种属性：

- 一种是数据属性（对象字面量添加的属性就是数据属性）
- 另一种时访问器属性（需要使用特定的对象 API 才能定义）。

## 数据属性

数据属性中的 4 个特性

- [[Configurable]]: 能否通过 delete 操作符删除属性 能否修改属性的特性 能否修改成访问器属性（普通方式- 添加的属性该特性默认为 true 通过 defineProperty 方式定义的属性默认为 false）
- [[Enumerable]]: 能否通过 for-in 遍历 （普通方式添加的属性该特性默认为 true 通过 defineProperty 方式定义的属性默认为 false）
- [[Writable]]: 能否修改属性的值 （普通方式添加的属性该特性默认为 true 通过 defineProperty 方式定义的属性该特性默认为 false）
- [[Value]]: 该属性的属性值 读取这个属性时读取的为这个值 修改改属性时 修改的也是这个值 默认为 undefined

我们可以通过 Object.getOwnPropertyDescriptor API 来得知对象中属性具有的特性

```js
const obj = {
  name: 'hjx',
}

console.log(Object.getOwnPropertyDescriptor(obj, 'name'))
/** 输出结果
{
    configurable: true
    enumerable: true
    value: "hjx"
    writable: true
}

结论：obj.name 是一个数据属性
它具有以下特性：
  1. 可操作
  2. 可枚举
  3. 值为 'hjx'
  4. 可修改

当我们通过 obj.name 访问一个数据属性的值时，js 引擎取得就是该属性的 [[value]] 特性
 */
```

## 访问器属性

访问器属性中的 4 个特性

- [[Configurable]]: 是否可操作
- [[Enumerable]]: 是否可枚举
- [[Get]]: 默认 undefined
- [[Set]]: 默认 undefined

访问器属性的定义需要借助于 Object.defineProperty API

```js
const obj = {}
Object.defineProperty(obj, 'name', {
  get() {
    return 'hjx'
  },
})

console.log(Object.getOwnPropertyDescriptor(obj, 'name'))
/** 输出结果
{
    configurable: false
    enumerable: false
    get: ƒ get()
    set: undefined
}

当我们通过 obj.name 访问这个访问器属性的值时，js 引擎会调用 [[get]] 这个函数并将值返回
 */
```
