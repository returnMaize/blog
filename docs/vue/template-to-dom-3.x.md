## 介绍

了解 `vue 3.x` 组件渲染原理之前，我希望已经知道了 `vue 2.x` 组件渲染原理。因为这样会让你更轻松的理解本章内容，也会对这两个版本的组件渲染原理进行一个比较。

为此我们先回顾一下 `vue 2.x` 的组件渲染原理：

代码：`new Vue({ render: h => h(App) }).$mount('#app')`

- 首先是对根组件渲染，渲染时会执行上述代码中的 render 函数。
- 根据传入的组件对象 App 创建出组件 vnode，然后调用 patch 进行组件 vnode 渲染
- 发现是组件 vnode，首先实例化 App 组件，然后手动执行 $mount 方法开始渲染 App 组件中模版
- 调用 App.render 函数创建组件中模版 vnode，然后调用 patch 进行组件内部模版 vnode 渲染
- 渲染完成后将渲染好的 DOM 元素插入到页面中

**简单概括 `vue 2.x` 组件渲染过程**

- 组件实例化
- 组件 vnode => dom

## 组件 Vnode 创建

与 `2.x` 不同的是，`3.x` 不再通过类的方式对组件进行实例化，而是通过对象字面量的方式完成创建。

入口代码：`createApp(App).mount('#app')`

**createApp**

```ts
export const createApp = ((...args) => {
  // 创建 app 对象
  const app = ensureRenderer().createApp(...args)

  const { mount } = app
  // 重写 mount 方法
  app.mount = (containerOrSelector: Element | ShadowRoot | string): any => {
    // ...
  }

  return app
}) as CreateAppFunction<Element>

// ensureRenderer 最后会调用 baseCreateRenderer 生成渲染器
function baseCreateRenderer(
  options: RendererOptions,
  createHydrationFns?: typeof createHydrationFunctions
): any {
  // ...
  // 很多和渲染相关的辅助函数，类似 2.x 中的 patch 方法

  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate),
  }
}

// createApp
export function createAppAPI<HostElement>(
  render: RootRenderFunction,
  hydrate?: RootHydrateFunction
): CreateAppFunction<HostElement> {
  return function createApp(rootComponent, rootProps = null) {
    if (rootProps != null && !isObject(rootProps)) {
      __DEV__ && warn(`root props passed to app.mount() must be an object.`)
      rootProps = null
    }

    const context = createAppContext()
    const installedPlugins = new Set()

    let isMounted = false
    // 通过字面量方式创建 app
    const app: App = (context.app = {
      _uid: uid++,
      _component: rootComponent as ConcreteComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      // ... use mixin component mount 等方法
    })

    return app
  }
}
```

可以看到 `createApp(App)` 做的事情就是创建出一个 app，它代表着整个应用的根，它会将 `App` 作为根组件挂载到 `app._component` 上。

有了 app 对象我们继续往后，拿到 app 对象后，`vue` 会重写 mount 方法并执行

```ts
// 首先执行重写的 mount 方法
export const createApp = ((...args) => {
  // 创建 app 对象
  const app = ensureRenderer().createApp(...args)

  const { mount } = app
  // 重写 mount 方法
  app.mount = (containerOrSelector: Element | ShadowRoot | string): any => {
    // 拿到真实 dom，#app
    const container = normalizeContainer(containerOrSelector)
    // ...
    // 挂载前将 #app 内部清空
    container.innerHTML = ''

    // 执行内部 mount 方法
    const proxy = mount(container)
    return proxy
  }

  return app
}) as CreateAppFunction<Element>

// 执行内部 mount 方法
export function createAppAPI<HostElement>(
  render: RootRenderFunction,
  hydrate?: RootHydrateFunction
): CreateAppFunction<HostElement> {
  return function createApp(rootComponent, rootProps = null) {
    const app: App = (context.app = {
      // ... 这里省略 app 对象的其他属性和方法
      // 我们只关注 mount 方法
      mount(rootContainer: HostElement, isHydrate?: boolean): any {
        // 这里的 rootContainer 就是我们 #app 元素
        // 首次渲染 isMounted = false
        if (!isMounted) {
          // 创建组件 vnode
          const vnode = createVNode(
            rootComponent as ConcreteComponent,
            rootProps
          )

          // 渲染组件 vnode
          render(vnode, rootContainer)

          isMounted = true
          app._container = rootContainer
          return vnode.component!.proxy
        }
      },
      // ...
    })

    return app
  }
}
```

**createVNode**

```ts
function _createVNode(
  type: VNodeTypes | ClassComponent | typeof NULL_DYNAMIC_COMPONENT,
  props: (Data & VNodeProps) | null = null,
  children: unknown = null,
  patchFlag: number = 0,
  dynamicProps: string[] | null = null,
  isBlockNode = false
): VNode {
  // 这里会根据传入的 type 给 vnode 打上标记，这里我们 type 传入的是组件对象 App
  // 所以命中 STATEFUL_COMPONENT，表示我们创建的 vnode 是一个组件 vnode
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : __FEATURE_SUSPENSE__ && isSuspense(type)
    ? ShapeFlags.SUSPENSE
    : isTeleport(type)
    ? ShapeFlags.TELEPORT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : isFunction(type)
    ? ShapeFlags.FUNCTIONAL_COMPONENT
    : 0
  // 通过字面量方式创建组件 vnode
  const vnode: VNode = {
    __v_isVNode: true,
    [ReactiveFlags.SKIP]: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    children: null,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
  }
  // 存在 children 便规范化 children，这里我们没有传
  normalizeChildren(vnode, children)
  // 返回创建好的组件 vnode
  return vnode
}
```

**组件 vnode 创建总结**

可以看到 `3.x` 创建组件 vnode 和 `2.x` 创建组件 vnode 在流程上大致相同，都是通过在 `mount` 时先创建组件 vnode，然后再渲染 vnode。不同的是 `2.x` 使用的是类的方式创建组件 vnode，而 `3.x` 使用的对象字面量方式进行创建。

总结：`createApp(App).mount('#app')`

- 首先会创建一个 app 对象，它代表应用根对象。创建 app 对象的前会先确定渲染器，然后才是 app 对象的创建，创建完成 app 对象后会对 mount 方法进行重写，最后返回 app 对象
- mount 方法首先会通过 #app 拿到真实元素节点，然后会通过我们传入的 App 对象创建出组件 vnode，然后再渲染组件 vnode

## 组件 Vnode 渲染

**render**

```ts
// 这是渲染 vnode 的执行代码 render(vnode, rootContainer)
const render: RootRenderFunction = (vnode, container) => {
  // 这里 vnode 是我们的 App 组件 vnode
  // container 是我们的 #app 元素
  if (vnode == null) {
    // ...
  } else {
    // 渲染组件 vnode
    patch(container._vnode || null, vnode, container)
  }
}
```

**patch**

```ts
const patch: PatchFn = (
  n1, // oldVnode 首次渲染为 null
  n2, // newVnode 这里是我们的组件 Vnode
  container, // #app
  anchor = null,
  parentComponent = null,
  parentSuspense = null,
  isSVG = false,
  optimized = false
) => {
  const { type, ref, shapeFlag } = n2
  switch (type) {
    case Text:
      // ...
      break
    case Comment:
      //...
      break
    case Static:
      // ...
      break
    case Fragment:
      // ...
      break
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        // ...
      } else if (shapeFlag & ShapeFlags.COMPONENT) {
        // 命中组件 vnode 渲染
        processComponent(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          optimized
        )
      }
    // ... else if（其他类型的 vnode 处理）
  }
}

const processComponent = (
  n1: VNode | null, // null
  n2: VNode, // 组件 vnode
  container: RendererElement, // #app 元素
  anchor: RendererNode | null,
  parentComponent: ComponentInternalInstance | null,
  parentSuspense: SuspenseBoundary | null,
  isSVG: boolean,
  optimized: boolean
) => {
  if (n1 == null) {
    if (n2.shapeFlag & ShapeFlags.COMPONENT_KEPT_ALIVE) {
      // ...
    } else {
      mountComponent(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        optimized
      )
    }
  } else {
    // 组件更新逻辑
  }
}

const mountComponent: MountComponentFn = (
  initialVNode, // 组件 vnode
  container, // #app
  anchor,
  parentComponent,
  parentSuspense,
  isSVG,
  optimized
) => {
  // 创建组件实例，这里我们直接跳过组件实例创建过程，它和渲染不强相关
  const instance: ComponentInternalInstance = (initialVNode.component =
    createComponentInstance(initialVNode, parentComponent, parentSuspense))

  // 启用渲染副作用函数
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
  // 调用 effect 函数，这里传入了 componentEffect 和 prodEffectOptions 两个参数
  // effect 函数会在开始时调用一次 componentEffect 函数
  // 并且当 prodEffectOptions 中数据发生变化时也会调用一遍
  instance.update = effect(function componentEffect() {
    if (!instance.isMounted) {
      let vnodeHook: VNodeHook | null | undefined
      const { el, props } = initialVNode
      const { bm, m, parent } = instance

      // 创建模版对应的 vnode 并挂载到组件实例上（在 vue 2.x 中是 _vnode）
      const subTree = (instance.subTree = renderComponentRoot(instance))
      // 将模版中的 vnode 渲染成真实 dom
      patch(null, subTree, container, anchor, instance, parentSuspense, isSVG)

      instance.isMounted = true
    } else {
      // 更新组件逻辑
    }
  }, prodEffectOptions)
}
```

**renderComponentRoot**

`renderComponentRoot` 用来创建组件内部模版的 vnode。

```ts
export function renderComponentRoot(
  instance: ComponentInternalInstance
): VNode {
  const {
    type: Component,
    vnode,
    proxy,
    withProxy,
    props,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit,
    render,
    renderCache,
    data,
    setupState,
    ctx,
  } = instance

  let result
  // 执行组件实例的 render 函数生成模版对应的 vnode
  result = normalizeVNode(
    render!.call(
      proxyToUse,
      proxyToUse!,
      renderCache,
      props,
      setupState,
      data,
      ctx
    )
  )
  // 返回创建好的 vnode
  return result
}
```

**patch**

patch 用来将 `subTree` 渲染成真实的 DOM

```ts
const patch: PatchFn = (
  n1,
  n2,
  container,
  anchor = null,
  parentComponent = null,
  parentSuspense = null,
  isSVG = false,
  optimized = false
) => {
  const { type, ref, shapeFlag } = n2
  switch (type) {
    // case ...
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        // 这里我们假设 App 组件中模版均为普通元素
        processElement(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          optimized
        )
      } // else if ...
  }
}

const processElement = (
  n1: VNode | null,
  n2: VNode,
  container: RendererElement,
  anchor: RendererNode | null,
  parentComponent: ComponentInternalInstance | null,
  parentSuspense: SuspenseBoundary | null,
  isSVG: boolean,
  optimized: boolean
) => {
  if (n1 == null) {
    mountElement(
      n2,
      container,
      anchor,
      parentComponent,
      parentSuspense,
      isSVG,
      optimized
    )
  } else {
    // 更新逻辑
  }
}

// mountElement 将普通元素 vnode 转化成真实 dom 并完成插入操作
const mountElement = (
  vnode: VNode,
  container: RendererElement,
  anchor: RendererNode | null,
  parentComponent: ComponentInternalInstance | null,
  parentSuspense: SuspenseBoundary | null,
  isSVG: boolean,
  optimized: boolean
) => {
  let el: RendererElement
  let vnodeHook: VNodeHook | undefined | null
  const { type, props, shapeFlag, transition, scopeId, patchFlag, dirs } = vnode
  if (
    !__DEV__ &&
    vnode.el &&
    hostCloneNode !== undefined &&
    patchFlag === PatchFlags.HOISTED
  ) {
    // ...
  } else {
    // 创建当前 vnode 对应的元素
    // hostCreateElement 就是调用了原生的 document.createElement API
    el = vnode.el = hostCreateElement(
      vnode.type as string,
      isSVG,
      props && props.is
    )

    // mountChildren 做的事情非常简答
    // 拿到当前 vnode 中的 children vnode，递归调用 mountElement 完成创建和挂载
    mountChildren(
      vnode.children as VNodeArrayChildren,
      el,
      null,
      parentComponent,
      parentSuspense,
      isSVG && type !== 'foreignObject',
      optimized || !!vnode.dynamicChildren
    )
  }

  // 等到 vnode 中所有元素都完成创建之后开始递归插入
  hostInsert(el, container, anchor)
}
```

至此，组件的渲染流程就完成了。最后我们对本章进行一个简单总结。

- vnode.el 表示 vnode 对应的真实 dom 元素
- vnode.component 表示对应的组件实例
- componentInstance.subTree 表示组件内部模版对应的 vnode
- componentInstance.vnode 表示的是组件 vnode

**总结**

组件的渲染是在 `mount` 方法中执行的，首先 vue 会通过组件对象创建出一个组件 vnode，然后会使用渲染器去渲染这个组件 vnode，渲染器发现这个 vnode 是个组件类型，便会调用 `mountComponent` 对组件 vnode 进行挂载，`mountComponent` 首先会创建出组件 vnode 的实例对象，然后会执行一个带副作用的渲染函数，该函数会在首次运行时执行 `componentEffect` 函数。`componentEffect` 函数会通过调用组件实例上的 render 函数生成 `subTree`（也就是组件内部模版对应的 vnode），然后再通过 `patch` 方法将将 `subTree` 转化成真实 DOM。

这里我们假设 `subTree` 均为普通元素，`patch` 会命中 `processElement` 逻辑，`processElement` 会执行 `mountElement` 方法对普通元素进行挂载。`mountElement` 首先会通过原生 DOM API document.createElment 创建出 vnode 最外层元素，然后遍历 vnode.children 递归调用 `mountElement` 创建所有的子元素，直到最后一个子元素创建完成，再递归完成插入操作。
