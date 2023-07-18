## 介绍

在 `vue` 中，当模版中需要的数据需要经过一定的计算才能能得到时，我们通常使用计算属性。而每当我们计算属性中的响应式数据发生变化时，计算属性都会重新进行计算，页面也会重新渲染。本章我们将揭秘 `vue` 是如何实现计算属性的。

## 计算属性的依赖收集

#### 计算属性初始化

所有的组件在渲染前都会调用 `Vue.extend` 将组件对象转化成组件构造器 `Ctor`，然后才是组件实例化及组件内部 template => dom 过程。

```ts
// 组件构造器生成时会初始化计算属性
Vue.extend = function (extendOptions: Object): Function {
  if (Sub.options.computed) {
    //
    initComputed(Sub)
  }
}

function initComputed(Comp) {
  const computed = Comp.options.computed
  for (const key in computed) {
    // 将计算属性通过 key 和 value 的形式挂到组件构造器的原型上
    defineComputed(Comp.prototype, key, computed[key])
  }
}

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop,
}

export function defineComputed(
  target: any,
  key: string,
  userDef: Object | Function
) {
  // 这里我们不考虑对象形式的计算属性（以 key: fn 形式为例）
  sharedPropertyDefinition.get = createComputedGetter(key)

  // 代理构造器原型，当我们访问 xxx 计算属性时，实际会调用 sharedPropertyDefinition.get 方法
  // 并返回其执行结果
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

function createComputedGetter(key) {
  // 当我们访问 this.key 计算属性时，拿到的就是 computedGetter 执行完后的结果
  return function computedGetter() {
    // ...
  }
}
```

组件构造器总结：`vue` 会遍历用户传入的 computed 对象，并且通过 `Object.defineProperty` 方法劫持组件构造器原型的属性访问，当我们访问原型上的某个属性时，实际上返回的是 `vue` 包装好的 computedGetter 函数执行结果。

组件构造器生成完之后便会进入组件实例化，我们看下组件实例化过程中 computed 做了那些事

**组件实例化**

```ts
Vue.prototype._init = function (options?: Object) {
  const vm: Component = this
  // ...
  initState(vm)
  // ...
}

export function initState(vm: Component) {
  if (opts.computed) initComputed(vm, opts.computed)
}

const computedWatcherOptions = { lazy: true }

function initComputed(vm: Component, computed: Object) {
  // 组件实例上添加 _computedWatchers 属性，里面存放在所有的计算属性 watcher
  const watchers = (vm._computedWatchers = Object.create(null))

  for (const key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get

    // 每一个计算属性的 key 都对应一个计算属性 watcher（computedWatcher）
    watchers[key] = new Watcher(
      vm,
      getter || noop,
      noop,
      computedWatcherOptions // lazy 为 true
    )
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
    this.vm = vm
    // 计算属性 watcher 的 lazy 为 true
    this.lazy = !!options.lazy
    // 计算属性 watcher 初始化时 dirty，它标识计算属性是否脏了。如果脏了则需要重新计算
    this.dirty = this.lazy

    // expOrFn 就是计算属性对应的 getter 函数（用户定义的 getter）
    this.getter = expOrFn

    // lazy 为 true，不会执行 get
    this.value = this.lazy ? undefined : this.get()
  }
}
```

组件实例化总结：可以看到组件在实例化过程中会给每个计算属性 key 创建一个与之对应的 computedWatcher，这个 computedWatcher 记录着计算属性 key 对应的 getter 函数。

**组件内部 vnode 的创建**

```ts
// 组件首次渲染时会创建组件的 renderWatcher
class Watcher {
  // 首次渲染执行 get 方法
  get() {
    // 记录当前组件的 renderWatcher
    pushTarget(this)

    // 调用 updateComponent 方法渲染组件 render => vnode => dom
    // 在 render => vnode 的过程中访问到计算属性
    value = this.getter.call(vm, vm)

    // 移除当前组件的 renderWatcher
    popTarget()
    return value
  }
}

// 访问到计算属性
function createComputedGetter(key) {
  // 渲染 vnode 过程中访问计算属性本质就是调用 computedGetter 函数，并将结果返回
  return function computedGetter() {
    // 拿到当前计算属性 key 对应的 computedWatcher
    const watcher = this._computedWatchers && this._computedWatchers[key]

    // 初始实例化的 computedWatcher.dirty 为 true
    if (watcher.dirty) {
      // 执行 evaluate
      /**
        evaluate() {
          this.value = this.get();
          this.dirty = false;
        }
      */
      watcher.evaluate()
      // 可以看到 evaluate 做的事情就是调用用户定义的 getter 函数拿到结果并且将结果挂到
      // computedWatcher.value 上，然后将 computedWatcher 赋值为 false。
      // 这点很重要，如果下次还有其它地方用到了这个计算属性，它将不会重新计算，而是直接返回

      /* 当我们调用 this.get 函数求值的过程中会执行 pushTarget，此时的 Dep.target
      会变成 computedWatcher，然后会执行用户传入的 getter 函数，然后此时会访问 getter 函数
      依赖的响应式数据，然后这个响应式数据会收集到当前的 computedWatcher，然后完成求值操作返回
      计算后的结果，然后 Dep.target 变会当前组件的 renderWatcher，然后将求值到的结果挂载到 computedWatcher.value 上，最后将 computedWatcher.dirty 赋值为 false
      */
    }

    // 此时 Dep.target 是当前组件的 renderWatcher
    // watcher 是 computedWatcher
    if (Dep.target) {
      watcher.depend()
    }

    // 返回求值好的结果
    return watcher.value
  }
}

// computedWatcher watcher.depend()
class Watcher {
  depend() {
    let i = this.deps.length
    while (i--) {
      // 拿到 computedWatcher 中所有的 dep，也就是依赖的响应式数据的 key 对应的 dep
      // 然后执行 dep.depend()
      this.deps[i].depend()
    }
  }
}

// 计算属性中的响应式数据 key 对应的 dep
class Dep {
  depend() {
    // Dep.target 是 renderWatcher
    if (Dep.target) {
      // renderWatcher.addDep()
      Dep.target.addDep(this)
    }
  }
}

// renderWatcher
class Watcher {
  addDep(dep: Dep) {
    dep.addSub(this)
  }
}

// 计算属性中的响应式数据 key 对应的 dep
class Dep {
  addSub(sub: Watcher) {
    // 响应式数据 key 收集渲染 watcher
    this.subs.push(sub)
  }
}

// 上面的逻辑可能有点绕，可以多看几遍
```

**计算属性的依赖收集总结：**

- 在通过 `Vue.extend` 将组件对象转化为组件构造器的过程中，会对用户编写计算属性的 getter 函数进行包装，并且会劫持实例对计算属性的访问。当我们通过组件实例访问 xxx 计算属性时，实际上访问的是包装好的 getter 函数的执行结果。
- 组件构造器创建完成后便会进入组件的实例化，实例化过程中 `vue` 会为每一个计算属性创建一个 computedWatcher，这个 computedWatcher 存在两个比较重要的属性，dirty 和 value。其中 dirty 代表着计算属性是否需要重新计算，初始化时是 true。而 value 表示计算属性计算后的结果。
- 组件实例化完成之后便会开始渲染组件内部的 vnode，在渲染这些 vnode 过程中会访问到我们定义的计算属性，这时便会执行 `vue` 给我们包装好的 `getter` 函数。函数首先会拿到这个计算属性的 computedWatcher，然后看 dirty 字段是否为 true，如果是 true，则调用用户传入的 `getter` 函数计算结果，如果是 false，则直接返回 computedWatcher.value。
- 首次初始化的 computedWatcher.dirty 都为 true，这时 `vue` 会执行用户的 `getter` 方法，然后便会访问到 `getter` 函数中的响应式数据，这些响应式数据便会将当前的 computedWatcher 作为依赖收集起来，收集完成之后计算结果也会被计算出来，`vue` 会将计算结果挂到 computedWatcher.value 上。
- 完成计算之后 `vue` 又会调用 `computedWatcher.depend()`，这个方法会遍历所有的 computedWatcher 依赖的响应式数据 key 对应的 dep，并且再次完成一次依赖收集，由于计算属性已经计算完成，此时的 `Dep.watcher` 为 组件的 renderWatcher，所以此时计算属性中的响应式数据又会对当前组件的 renderWatcher 进行收集。

**一句话总结计算属性依赖收集：**

计算属性中的响应式数据首先会收集 computedWatcher，然后又会收集依赖计算属性的组件的 renderWatcher。

## 计算属性的派发更新

计算属性的派发更新相对简单，由于 computedWatcher 要不组件的 renderWatcher 先创建，所以在更新时也会先执行 computedWatcher.update。

```ts
// 计算属性中的响应式数据发生变化，触发 `dep.notify`
class Dep {
  notify() {
    const subs = this.subs.slice()
    // 计算属性中的响应式数据即会收集 computedWatcher，也会收集 renderWatcher
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// computedWatcher.update
class Watcher {
  update() {
    // 计算属性的 lazy 属性为 true
    if (this.lazy) {
      // 将计算属性的 computedWatcher.dirty 赋值为 true
      this.dirty = true
    }
  }
}

// 可以看到计算属性的派发更新非常简答，就是将 computedWatcher.dirty 赋值为 true
// computedWatcher 更新完成之后便会更新 renderWatcher.update，它会重新渲染组件
// 然后便会在访问到计算属性的时候重新求值（因为此时的 dirty 为 true）
```

**计算属性派发更新总结**

当计算属性依赖的响应式数据发生变化时，会触发 `computedWatcher.update` 方法，它做的事情就是将 `computedWatcher.dirty` 赋值为 false，由于计算属性中的响应式数据即会收集 `computedWatcher`，又会收集 `renderWatcher`，所以此时又会触发组件的重新渲染，重新渲染的过程中又会访问到计算属性，这是的 `computedWatcher.dirty` 为 true，所以计算属性会重新进行计算。
