## 介绍

与响应式相关的除了 data 和 computed 之外，我们还会定义 watch。这里我们把它称之为 userWatch。
本章我们将深入其中，看看 `vue` 是如何实现 userWatch 的。

## watch 的依赖收集

```ts
Vue.prototype._init = function (options?: Object) {
  const vm: Component = this
  // ..
  // watch 的初始化同样是在 initState 中
  initState(vm)
  // ...
}

export function initState(vm: Component) {
  if (opts.watch && opts.watch !== nativeWatch) {
    // 初始化 watch
    initWatch(vm, opts.watch)
  }
}

function initWatch(vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key]
    // vue2.x 中的 watch 可以是 function object arrry
    // 这里我们省略数组情况下的逻辑
    createWatcher(vm, key, handler)
  }
}

// 创建 userWatcher，到目前为止我们接触了三种 Watcher （renderWatcher、computedWatcher）
function createWatcher(
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  // 处理对象形式
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  // 调用 this.$watch 初始化 userWatcher
  return vm.$watch(expOrFn, handler, options)
}
```

**$watch**

```ts
Vue.prototype.$watch = function (
  expOrFn: string | Function, // 字符表达式，如 person.name
  cb: any, // 对应的处理函数
  options?: Object // 配置 (deep | immediate | sync)
): Function {
  const vm: Component = this
  options = options || {}
  // 表示这是一个 userWatcher
  options.user = true
  // 实例化 userWatcher
  const watcher = new Watcher(vm, expOrFn, cb, options)
  if (options.immediate) {
    // 如果配置了 immediate，立即执行一次处理函数
    cb.call(vm, watcher.value)
  }
}

export default class Watcher {
  constructor(
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    // user 为 true
    this.user = !!options.user

    // expOrFn 是一个字符 如：person.name
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      // parsePath 将会返回一个函数，这个函数会通过 expOrFn 字符，访问一遍它对应的值
      this.getter = parsePath(expOrFn)
    }

    // lazy 为 false，执行 this.get
    this.value = this.lazy ? undefined : this.get()
  }
}

export function parsePath(path: string): any {
  const segments = path.split('.')
  // 这里的 obj 就是当前组件的实例
  // 返回的这个函数会根据 path 访问组件实例对应的数据
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}

class Watcher {
  get() {
    // 此时的 watcher 是 userWatcher
    pushTarget(this)
    let value
    const vm = this.vm

    // 这里的 getter 函数就是根据用户监听的字符表达式，在实例上访问一遍对应的数据完成依赖收集
    value = this.getter.call(vm, vm)

    // 如果配置了 deep 选项
    if (this.deep) {
      // 递归访问字符表达式中的所有属性完成依赖收集
      traverse(value)
    }

    // 依赖收集完成后，移除 userWatcher
    popTarget()

    return value
  }
}
```

**watch 的依赖收集总结**

组件在实例化时会进行用户 watch 的初始化，它会为每个用户定义的 watch 创建出一个与之对应的 userWatcher，然后在实例化 userWatcher 的过程中会根据用户 watch 定义的字符表达式访问实例中与之对应的响应式数据，这时响应式数据就会将当前的 userWatcher 当作依赖收集起来。

## watch 的派发更新

与 renderWatcher 和 computedWatcher 一样，userWatcher 同样是调用 update 方法进行更新

```ts
class Watcher {
  update() {
    if (this.lazy) {
      // 计算属性专属
      this.dirty = true
    } else if (this.sync) {
      // userWatcher 专属，如果配置了 sync 选项，userWatcher 会同步执行处理函数
      this.run()
    } else {
      // userWatcher 在没有配置 sync 选项的情况下，会和 renderWatcher 一样放入队列中，
      // 并且在 nextTick 后执行
      queueWatcher(this)
    }
  }

  // nextTick 之后执行 userWatcher.run()
  run() {
    // 执行用户定义的处理函数
    this.get()
  }
}
```

**watch 派发更新总结**

在没有配置 options.sync 的情况下，userWatcher 更新操作其实和 renderWatcher 一样，都会被放入到 watcherQueue 中，然后在 nextTick 后执行 run 方法完成更新
