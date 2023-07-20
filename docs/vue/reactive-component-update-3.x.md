## 介绍

在阅读本章之前，我希望你已经了解了 `vue 2.x` 中的组件更新原理。为了更好的阅读体验，我们还是先一起回顾一下 `vue 2.x` 中的组件更新原理。

- 组件在初始化渲染前会创建一个与之对应的 renderWatcher，它拥有一个 `updateComponent` 方法用来渲染组件
- 在 renderWatcher 实例化时会调用一次 `updateComponent` 方法，这是会创建组件模版中的 vnode，从而访问到模版中使用的响应式数据，会触发对应属性的 `get` 方法，然后该属性对应的 `dep` 会将当前的 renderWatcher 作为依赖收集起来。
- 当模版中的响应式数据发生变化时，会触发对应属性的 `set` 方法，然后该属性对应的 `dep` 会通知之前收集的 renderWatcher 进行 `update` 完成组件更新

## 3.x 中的响应式对象

这里我们假设你已经对 `vue 3.x` 中的响应式 API 了如指掌，如果你对其还不太了解，你应该去阅读 [vue docs](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html) 响应式原理章节。

这里我们以 `reactive` API 为例进行讲解

```ts
// 通常我们会这样创建一个响应式对象
const state = reactive({ count: 0 })

// reactive 源码
export function reactive(target: object) {
  // ...
  // 创建响应式对象
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers
  )
}

function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>
) {
  // 使用 Proxy 代理用户传入的对象
  // baseHandlers 对应 mutableHandlers
  const proxy = new Proxy(target, baseHandlers)
  // 返回 proxy 对象
  return proxy
}

export const mutableHandlers: ProxyHandler<object> = {
  get, // 访问时触发
  set, // 重新赋值时触发
  deleteProperty, // 删除时触发
  has,
  ownKeys,
}

const get = /*#__PURE__*/ createGetter()

function createGetter(isReadonly = false, shallow = false) {
  return function get(target: Target, key: string | symbol, receiver: object) {
    // 获取访问的值
    const res = Reflect.get(target, key, receiver)

    // 依赖收集（下面会具体展开，这里可以先忽略）
    track(target, TrackOpTypes.GET, key)

    if (isObject(res)) {
      // 如果访问的值式对象类型，递归调用 reactive 代理对象
      return isReadonly ? readonly(res) : reactive(res)
    }

    // 返回访问的值
    return res
  }
}
```

**响应式对象总结**

可以看到 `vue 3.x` 中通过 proxy 实现响应式对象，对比 Object.defineProperty 它可以监听到对象属性的新增和删除。并且对于嵌套过深的对象，它不再是无脑递归变成响应式，而是当访问到具体的数据时才进行 `reactive`

## 3.x 中的依赖收集

3.x 中的依赖收集是通过 `track` 函数去完成的

**track**

```ts
/*
铺垫：
targetMap：它是 WeakMap 数据结构，以响应式对象为 key，depsMap 为值
depsMap：它是 Map 数据结构，以访问的响应式对象属性为 key，dep 为值
dep：它是 Set 数据结构，用来收集 effect 函数。对于组件更新来说，这里的 effect 就是用来更新组件用的
*/
export function track(target: object, type: TrackOpTypes, key: unknown) {
  // 拿到响应式数据对应的 depsMap
  let depsMap = targetMap.get(target)
  // 拿到访问的属性对应的 dep
  let dep = depsMap.get(key)
  // 将 activeEffect 收集到 dep 中
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
  }
}

// activeEffect 是啥？
// 让我们回到组件首次渲染的时候
const mountComponent: MountComponentFn = (
  initialVNode,
  container,
  anchor,
  parentComponent,
  parentSuspense,
  isSVG,
  optimized
) => {
  // 创建组件实例
  const instance: ComponentInternalInstance = (initialVNode.component =
    createComponentInstance(initialVNode, parentComponent, parentSuspense))

  // 调用带副作用的渲染函数
  setupRenderEffect(
    instance,
    initialVNode,
    container,
    anchor,
    parentSuspense,
    isSVG,
    optimized
  )
}

const setupRenderEffect: SetupRenderEffectFn = (
  instance,
  initialVNode,
  container,
  anchor,
  parentSuspense,
  isSVG,
  optimized
) => {
  // create reactive effect for rendering
  instance.update = effect(
    // componentEffect 渲染组件
    function componentEffect() {
      // 创建组件内模版对应的 vnode
      const subTree = (instance.subTree = renderComponentRoot(instance))

      // 将模版 vnode 渲染成真实的 dom
      patch(null, subTree, container, anchor, instance, parentSuspense, isSVG)
    },
    prodEffectOptions
  )
}

export function effect<T = any>(
  fn: () => T,
  options: ReactiveEffectOptions = EMPTY_OBJ
): ReactiveEffect<T> {
  if (isEffect(fn)) {
    fn = fn.raw
  }
  const effect = createReactiveEffect(fn, options)
  // 计算属性 lazy 为 false
  if (!options.lazy) {
    effect()
  }
  return effect
}

function createReactiveEffect<T = any>(
  fn: () => T,
  options: ReactiveEffectOptions
): ReactiveEffect<T> {
  const effect = function reactiveEffect(): unknown {
    // 移除上一次依赖
    cleanup(effect)
    try {
      // 当前 effect 函数压入 effectStack
      effectStack.push(effect)
      // 保留当前 activeEffect
      activeEffect = effect
      // 执行 fn，这里的 fn 就是 componentEffect，用来渲染组件
      // 渲染时会创建组件模版中的 vnode，访问到响应式数据，触发 get 完成依赖收集
      return fn()
    } finally {
      // 完成依赖收集，移除 activeEffect
      effectStack.pop()
      // activeEffect 赋值为上一个 effect，这对于嵌套组件非常有用
      activeEffect = effectStack[effectStack.length - 1]
    }
  } as ReactiveEffect
  // ...
  effect.options = options
  return effect
}
// 解答：组件渲染时 activeEffect 本质就是 componentEffect，它将用于组件渲染
```

**依赖收集总结**

`vue 3.x` 在组件渲染时会调用 `effect` 函数，并传入更新组件函数 `componentEffect`。`effect` 函数会执行 `componentEffect` 函数对组件进行渲染，并且会在渲染组件前将 `componentEffect` 进行简单包装作为 `activeEffect`。渲染过程访问到了模版中的响应式数据进入 `proxy.get` 方法，`get` 方法会调用 `track` 进行依赖收集，会将 `activeEffect` 作为依赖存放到与之对应的 `dep` 中去（存放 activeEffect 的数据结构如下）

```ts
const targetMap = new WeakMap() // key 为 响应式数据对象，值为 depsMap
const depsMap = new Map() // key 为访问的对象属性，值为 dep
const dep = new Set() // 收集所有依赖到该属性值的 activeEffect
```

## 3.x 中的派发更新

当我们改变模版中依赖的响应式数据时，会触发对应代理对象的 `proxy.set`

```ts
function createSetter(shallow = false) {
  return function set(
    target: object,
    key: string | symbol,
    value: unknown,
    receiver: object
  ): boolean {
    // 设置新值
    const result = Reflect.set(target, key, value, receiver)
    // 调用 trigger
    trigger(target, TriggerOpTypes.SET, key, value, oldValue)
    // 返回设置结果（true）
    return result
  }
}

export function trigger(
  target: object,
  type: TriggerOpTypes,
  key?: unknown,
  newValue?: unknown,
  oldValue?: unknown,
  oldTarget?: Map<unknown, unknown> | Set<unknown>
) {
  // 拿到响应式数据对应的 depsMap
  const depsMap = targetMap.get(target)
  // 创建 effects
  const effects = new Set<ReactiveEffect>()

  const add = (effectsToAdd: Set<ReactiveEffect> | undefined) => {
    if (effectsToAdd) {
      effectsToAdd.forEach((effect) => {
        if (effect !== activeEffect || effect.allowRecurse) {
          effects.add(effect)
        }
      })
    }
  }

  // 拿到对应 key 的 dep（里面存放着收集的 effect）
  // 将所有的 effect 添加到 effects 中
  add(depsMap.get(key))

  const run = (effect: ReactiveEffect) => {
    if (effect.options.scheduler) {
      // 组件渲染存在 scheduler，会将 effect 作为微任务执行
      // 这里的 options 在首次渲染时传入
      effect.options.scheduler(effect)
    } else {
      // ...
    }
  }

  // 遍历所有的 effect 并通过 run 执行
  effects.forEach(run)
}

// 首次渲染
const setupRenderEffect: SetupRenderEffectFn = (
  instance,
  initialVNode,
  container,
  anchor,
  parentSuspense,
  isSVG,
  optimized
) => {
  // create reactive effect for rendering
  instance.update = effect(
    // 执行渲染组件
    function componentEffect() {
      // ...
    },
    prodEffectOptions // effect.options
  )
}

const prodEffectOptions = {
  scheduler: queueJob,
  // #1801, #2043 component render effects should allow recursive updates
  allowRecurse: true,
}

export function queueJob(job: SchedulerJob) {
  // 将 effect 放入队列
  queue.push(job)
  // 清洗队列
  queueFlush()
}

function queueFlush() {
  // 使用 Promise.then 创建微任务，在微任务中清洗队列
  currentFlushPromise = resolvedPromise.then(flushJobs)
}

function flushJobs(seen?: CountMap) {
  // 对队列中的 effect 进行排序
  queue.sort((a, b) => getId(a) - getId(b))

  for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
    // 拿到 effect
    const job = queue[flushIndex]
    // 执行 effect
    callWithErrorHandling(job, null, ErrorCodes.SCHEDULER)
  }
}

export function callWithErrorHandling(
  fn: Function,
  instance: ComponentInternalInstance | null,
  type: ErrorTypes,
  args?: unknown[]
) {
  let res
  try {
    // 执行 effect，完成派发更新，组件重新渲染。
    res = args ? fn(...args) : fn()
  } catch (err) {
    handleError(err, instance, type)
  }
  return res
}
```
