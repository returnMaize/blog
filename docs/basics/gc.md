## JS 中的内存管理

JS 中的内存管理是自动的，它没有为我们提供手动开辟内存空间的 API，也没有给我们提供释放内存 API。

```js
// JS 引擎自动为你开辟一块内存空间
let obj = { name: 'hjx' }

// JS 引擎自动释放这块内存空间
obj = null
```

## 垃圾

什么时候垃圾？

垃圾就是开辟了一片空间，但是没有使用这片空间，那这边空间就可以叫做垃圾。

下面我们来看看 JS 是通过什么方式回收垃圾，已经常见的垃圾回收算法（GC）

## 常见的 GC 算法

- 引用计数算法
- 标记清除算法
- 标记整理算法
- 分代回收（V8）

## 引用计数算法

JS 引擎为每一个块开辟的内存空间都维护一个引用数值。这块空间被引用一次数值 +1，断开引用数值就 -1，如果发现某块空间引用数值为 0。那么这块内存空间就会被视为垃圾被释放掉。

**示例**

```js
function foo() {
  const obj = { name: 'hjx' }
}

foo()

/**
 * foo 执行，开辟了一块空间 {name: 'hjx'}
 * 执行完成，空间为被引用，引用数值为 0
 * 垃圾，空间释放
 */
```

但这种垃圾回收存在很大的弊端，当遇到循环引用时，两个相互引用的对象它们的引用值永远不会为零。

**示例**

```js
function foo() {
  const obj1 = { name: 'hjx' }
  const obj2 = { name: 'cmx' }

  obj1.love = obj2
  obj2.love = obj1
}

foo()
/**
 * foo 执行，开辟空间 {name: 'hjx'} 和 {name: 'cmx'}
 * obj1.love = obj2 内存空间 {name: 'cmx'} 引用计数为1
 * obj2.love = obj1 内存空间 {name: 'hjx'} 引用计数为1
 * foo 执行完毕（内存无法释放）
 */
```

**优点：** 发现垃圾立马清楚

**缺点：** 无法清除循环引用

## 标记清除算法

1. 从根对象开始递归遍历所有可达对象并进行标记（这里的可达对象就是能够通过根对象直接或间接访问到的对象）

2. 遍历内存堆中所有对象，没有被标记的对象都是垃圾。

**示例**

```js
function foo() {
  const obj1 = { name: 'hjx' }
  const obj2 = { name: 'cmx' }

  obj1.love = obj2
  obj2.love = obj1
}

foo()
/**
 * 通过根对象 window 查找可达对象，没有可达对象（这里不考虑函数）
 * foo 执行完成，遍历堆中对象，发现 {name: 'hjx'} 和 {name: 'cmx'}
 * 两个内存空间未被标记，都是垃圾进行空间释放
 */
```

**优点**：对比引用计数解决了循环引用问题

**缺点**：释放垃圾内存空间时原地释放，导致空间碎片化

## 标记整理算法

和标记清除算法一样，不同的是。标记整理算法在释放空间前会将内存空间进行整理，有用的对象空间会放到一边，垃圾内存空间放到另一边，整理完成后释放垃圾空间。

**优点**：减少空间碎片化

**缺点**：整理空间需要时间，整理和释放空间都会阻塞主线程代码的执行。

## 分代回收（V8 垃圾回收机制）

V8 将内存空间一分为二，分为新生代和老生代。新生代主要存放一些周期性较短较小的对象（如函数执行时产生的局部变量），老生代主要存放一些周期性长，内存占用大的对象。

#### 新生代回收原理

新生代的空间会被均匀分为两部分，分别是 from 和 to，程序运行时使用到的内存都是 from 中的，to 空间会处于待定状态。v8 会通过标记清除算法将所有的可达对象全部拷贝到 to 空间中，然后存在 from 中的都会被视为垃圾进行清除。然后 V8 会将 from 变为 to，而 to 变为 from。这样便完成了新生代的垃圾回收。

补充：

- 拷贝对象需要花费较多的时间，所以新生代的内存一般比较小。
- 由于新生代空间小，所以很有可能出现 from 空间超出的情况。对于这种情况，v8 会将那些经历了两次 GC 还存活下来的对象进行晋升，将它们放到老生代内存中。

#### 老生代回收原理

老生代的空间会通过标记清除进行垃圾回收，但如果老生代中的最大空闲内存不足以存放新生代中晋升的对象时，这是 v8 又会采用标记整理算法进行垃圾回收和空间整理。

补充：

- 标记算法在标记时是会阻塞 JS 主线程代码运行的，v8 为此通过增量标记算法对其进行了优化。v8 并不会一次性标记完所有的对象，而是将标记操作分为了一个个的子任务，标记一点，执行一段 js 代码，再标记一点，再执行一点 js 代码。通过这种增量标记的方式，让标记操作不会长时间占用主线程。
