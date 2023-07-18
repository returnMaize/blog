## 介绍

在 `vue` 中，当组件中的响应式数据发生改变时，都会导致当前组件视图重新渲染。本章我们将揭秘 `vue` 是如何创建响应式数据，以及如何根据响应式数据更新组件。

## 响应式数据

问题 1: 什么是响应式数据？

问题 2: `vue` 是如何将数据变成响应式数据的？

原理：利用 `Object.definedProperty` API 将数据的所有属性转化为访问器属性。每个访问器属性都具有 `get` 和 `set`。当我们访问一个访问器属性的值时，js 引擎会调用 `get` 函数并拿到其结果进行返回，当我们给访问器属性的值重新赋值时，js 引擎会调用 `set` 函数。

如果你还不了解 `Object.definedProperty` 这个 API，那你一定要阅读 [mdn docs](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 进行掌握，因为它是 `vue` 实现响应式的原理，没有它就没有 `vue` 的响应式。

### 源码

了解了什么是响应式数据，我们来看看 `vue` 是何时将我们的数据转化为响应式数据，且做了那些事情。

```ts
// 每个组件实例化都会执行 _init 方法
Vue.prototype._init = function (options?: Object) {
  const vm: Component = this
  // ...
  // 执行 beforeCreate 钩子，可以注意到 beforeCreate 是在 initState 之前执行
  // 这也是为什么 beforeCreate 生命周期函数中无法访问到数据
  callHook(vm, 'beforeCreate')
  // 初始化组件中的数据 data、props、computed、methods ...
  initState(vm)
  // 执行 created，可以注意到 created 是在 initState 之后执行
  // 这也是为什么能在 created 生命周期函数中访问到数据的原因
  callHook(vm, 'created')
  // ...
}
```

**initState**

```ts
export function initState(vm: Component) {
  const opts = vm.$options
  // ...
  if (opts.data) {
    // 初始化 data，这里的 opts.data 就是我们传入的 data （通常它是一个函数返回一个数据对象）
    initData(vm)
  } else {
    observe((vm._data = {}), true /* asRootData */)
  }
}
```

**initData**

```ts
function initData(vm: Component) {
  let data = vm.$options.data
  // 因为 data 我们既可以传入对象也可以传函数，这里就是直接拿到我们最终的 data 数据挂到 vm._data 上
  data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {}

  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length

  // 遍历 data 中所有的属性
  while (i--) {
    const key = keys[i]
    // ... 这里省略逻辑：vue 会拿到 data 中所有的 key 和 methods props 中的 key 进行比较
    // 不允许和 methods 和 props 中的 key 重复，否则抛出警告（开发环境下）
    // 使用 proxy 对实例访问进行代理，当我们通过 this 访问的属性命中 data 中的 key 时
    // 就会直接返回 data 中对应 key 的值，这也是为什么我们在 data 中定义的数据可以直接通过 this.xxx 访问的原因
    proxy(vm, `_data`, key)
  }
  // 将数据转化成响应式数据
  observe(data, true /* asRootData */)
}
```

**observe**

```ts
export function observe(value: any, asRootData: ?boolean): Observer | void {
  let ob: Observer | void
  // 实例化 Observer，并传入 data 数据
  ob = new Observer(value)
  // 返回 Observer 实例
  return ob
}
```

**Observer**

```ts
export class Observer {
  value: any
  dep: Dep
  vmCount: number // number of vms that have this object as root $data

  constructor(value: any) {
    this.value = value
    this.dep = new Dep()

    // 将 Observer 实例挂到 data.__ob__ 上
    def(value, '__ob__', this)
    // 这里我们不考虑数组情况，只考虑对象
    // 调用 walk 方法
    this.walk(value)
  }

  // 这里 walk 就是将我们 data 转化成响应式数据
  walk(obj: Object) {
    // 拿到 data 中所有的 key
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      // 将 data 中所有的 key 转化成访问器属性
      defineReactive(obj, keys[i])
    }
  }
}
```

**defineReactive**

```ts
export function defineReactive(
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  // 每个 data 中的 key 都对应一个 dep，它是用来收集 Watcher；
  const dep = new Dep()

  // 通过 observe 递归将 data 中所有的属性都变成访问器属性
  let childOb = observe(val)

  // 通过 Object.defineProperty 将 key 转化为访问器属性
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    // 当我们通过 key 访问 data 中对应的值时触发 get 方法
    get: function reactiveGetter() {
      // ...
    },
    // 当我们修改 data 中的 key 的值时会触发 set 方法
    set: function reactiveSetter(newVal) {
      // ...
    },
  })
}
```

总结：当我们在组件中编写 `data() { return { ... } }` 这样代码后，`vue` 会在实例化该组件时调用 `initState` 对我们 `data` 进行处理，它会拿到我们返回的数据对象，然后通过 `Observer` 将我们的数据对象通过 `Object.defineProperty` 这个 API 递归将我们数据对象中所有的属性转化成访问器属性，每个属性都拥有 `get` 和 `set` 方法，分别会在访问和设置属性时调用。并且每个属性都对应一个 `dep`，它们用来收集 `Watcher`。

## 依赖收集

在了解依赖收集之前，我们先思考这么一个问题。`vue` 是什么时候做依赖收集的。我们不妨先大胆的猜测一下，它是在访问属性对应的值的时候进行收集的，为什么这么假设。因为你当前这个组件访问了我这个属性的值，那说明你这个组件依赖我这个属性的值，我便可以将你收集起来，等到我的值发生变化的时候再通知你这个组件更新。那么什么时候组件会访问到我们的数据呢，那肯定是在创建 VNode 的时候，我们知道 VNode 是对真实 DOM 的一个映射，它必须要拿到模版中访问到的响应式数据。

我们知道创建 VNode 是在 `$mount` 中执行的，`$mount` 本质调用的是 `mountComponent`。

**mountComponent**

```ts
export function mountComponent(
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  // 调用 beforeMount
  callHook(vm, 'beforeMount')

  // 定义 updateComponent，该方法用来将 render 函数转化成真实 DOM
  let updateComponent
  updateComponent = () => {
    vm._update(vm._render(), hydrating)
  }

  // 实例化 Watcher，这里 Watcher 为渲染 Watcher，它和组件渲染强相关
  // 渲染 Watcher 实例化时会调用一次 updateComponent 完成组件渲染
  // 在首次渲染组件的过程中完成依赖收集
  new Watcher(
    vm,
    updateComponent,
    noop,
    {
      before() {
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, 'beforeUpdate')
        }
      },
    },
    true /* isRenderWatcher */
  )

  // 调用 mounted 钩子
  callHook(vm, 'mounted')

  return vm
}
```

**Watcher**

```ts
export default class Watcher {
  constructor(
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    // 这里的 expOrFn 就是我们传入的 updateComponent，它用来渲染组件
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    }
    // lazy 为 false，这个值在 computedWatcher 时为 true
    // lazy 为 false，执行 this.get 方法
    this.value = this.lazy ? undefined : this.get()
  }

  get() {
    // 记入当前渲染 Watcher
    // 会讲当前 Watcher 挂载到 Dep.target 上
    // Dep.target = 当前渲染 Watcher
    pushTarget(this)

    let value
    const vm = this.vm
    // 调用 getter，也就是 updateComponent 方法，它会渲染组件
    // updateComponent工作流程：render => vnode => dom
    // 创建 vnode 的过程中便会访问到响应式数据中的属性，便会触发对应 key 的 get 方法
    value = this.getter.call(vm, vm)

    // 移除当前 Watcher
    popTarget()
    return value
  }
}
```

**创建 vnode 时访问属性的值，触发 get 函数**

```ts
export function defineReactive(
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  // 每个属性 key 都对应一个 dep
  const dep = new Dep()

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val

      // 这里的 Dep.target 就是我们当前组件的渲染 Watcher
      if (Dep.target) {
        // 依赖收集
        dep.depend()
      }

      // 返回对应 key 的值
      return value
    },

    set: function reactiveSetter(newVal) {
      // ...
    },
  })
}
```

**dep.depend()**

```ts
export default class Dep {
  constructor() {
    this.subs = []
  }

  depend() {
    if (Dep.target) {
      // 调用当前组件渲染 watcher 的 addDep 方法
      Dep.target.addDep(this)
    }
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
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
  }

  // 我们知道渲染 Watcher 对应其实是组件，而 dep 对应的其实是每个响应式数据的 key
  // addDep 就是要收集当前组件依赖的所有 key 对应的 dep
  addDep(dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        // 执行 dep.addSub
        dep.addSub(this)
      }
    }
  }
}

export default class Dep {
  static target: ?Watcher
  id: number
  subs: Array<Watcher>

  constructor() {
    this.id = uid++
    this.subs = []
  }

  // 将依赖当前 key 的组件渲染 Watcher 给收集起来放到 subs 中去
  addSub(sub: Watcher) {
    this.subs.push(sub)
  }
}

// 以上代码第一次看可能会有点绕，多看几遍就行了
```

依赖收集总结：组件渲染会经过：组件实例化 => vnode 创建 => DOM 这三个过程，在组件实例化的过程中，`vue` 会将我们传入的 data 数据转化成响应式数据，响应式数据中的每一个 key 都对应它们的 `get` 和 `set` 方法，他们会在访问和设置时调用。实例化完成之后，`vue` 会调用 `$mount` 方法完成组件渲染，每个组件的渲染都会实例化一个渲染 `watcher`，每个渲染 `watcher` 都对应一个 `updateComponent` 方法，它用来渲染组件。在实例化渲染 `watcher` 时，`vue` 首先会记录当前的渲染 `watcher`，然后调用 `updateComponent` 方法渲染组件，在渲染组件的过程会访问到响应式数据，便会触发对应 key 的 `get` 方法，而每一个 key 他们都对应着一个 `dep`，在 触发 `get` 时这个 `dep` 会将当前的渲染 `watcher` 存放到 `dep.subs` 中去，至此完成依赖收集。

## 派发更新

当我组件依赖的响应式数据发生变化时，便会触发对应 key 的 `set` 方法。

**set**

```ts
Object.defineProperty(obj, key, {
  enumerable: true,
  configurable: true,
  get: function reactiveGetter() {
    // ...
  },
  set: function reactiveSetter(newVal) {
    // 拿到原来的值
    const value = getter ? getter.call(obj) : val
    // 新值和老值对比，如果没有发生变化直接跳出
    if (newVal === value || (newVal !== newVal && value !== value)) {
      return
    }
    // 将新值赋值给老值
    val = newVal

    // 如果新值是对象类型，将新值也变成响应式数据
    observe(newVal)

    // 调用 dep.notify 更新组件
    dep.notify()
  },
})
```

**dep.notify**

```ts
export default class Dep {
  constructor() {
    this.id = uid++
    this.subs = []
  }

  notify() {
    // 拿到所有收集的 watcher（这里我们只考虑渲染 Watcher）
    const subs = this.subs.slice()
    // 遍历所有的渲染 watcher 然后执行 watcher.update 方法
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}
```

**update**

```ts
class Watcher {
  update() {
    // 将渲染 watcher 放到队列中去
    queueWatcher(this)
  }
}

export function queueWatcher(watcher: Watcher) {
  // ... 为了不增加阅读困难，这里省略了很多边界处理逻辑

  // 将渲染 watcher 放入队列中
  queue.push(watcher)

  // 在 nextTick 后清洗队列中所有的 watcher
  // nextTick，你现在可以理解成是一个异步微任务，之后的章节会单独进行分析
  // 组件更新设计成异步是为了性能考虑，不可能每次响应式数据都需要立即更新，因为视图的更新也会影响到数据
  // 所有我们可以将所有需要更新的任务再一次同步任务执行时全部统一收集起来，然后在一次事件循环后完成所有更新
  nextTick(flushSchedulerQueue)
}

function flushSchedulerQueue() {
  // 对 watcher 进行排序，保证更新顺序
  queue.sort((a, b) => a.id - b.id)

  // 遍历队列中所有 watcher，执行 run 方法
  for (index = 0; index < queue.length; index++) {
    watcher.run()
  }

  // ...
}

class Watcher {
  run() {
    // 调用 this.get 方法，也就是实例化 Watcher 执行的方法
    this.get()
  }

  get() {
    // 记入当前渲染 Watcher
    // 会讲当前 Watcher 挂载到 Dep.target 上
    // Dep.target = 当前渲染 Watcher
    pushTarget(this)

    let value
    const vm = this.vm
    // 调用 getter，也就是 updateComponent 方法。
    // 然后通过 updateComponent 方法对组件进行重新渲染
    value = this.getter.call(vm, vm)

    // 移除当前 Watcher
    popTarget()
    return value
  }
}
```

派发更新总结：当我们修改响应式数据中某个 key 的值时，这是便会触发这个 key 对应的 `set` 函数，这个函数便会通知这个 key 对应的 `dep` 执行 `notify` 方法，它会遍历所有收集的 watcher，并且调用 `watcher.update` 方法，`update` 方法会将当前通知的 watcher 放到一个 watcher 队列中，然后在 `nextTick` 后调用队列中所有 watcher 的 `run` 方法，这个方法会调用 `updateComponent` 方法完成组件的更新。
