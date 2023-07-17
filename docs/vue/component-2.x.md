## 介绍

对于组件化，我想无需我过多介绍。如果你还不了解什么是组件化，那你应该去阅读 [vue docs](https://cn.vuejs.org/guide/essentials/component-basics.html)。我不认为我的文笔能够超过尤大。

我想通过此篇文章让你了解一下问题：

- 组件渲染原理
- 组件注册原理
- 异步组件原理

## 组件渲染原理

上面文章我们已经知道 vue 是如何将模版渲染成视图的，但日常开发中我们很少会出现那种情况，毕竟我们很少会手写 render 函数，通常都是以组件的形式进行开发。同样以 `new Vue({ render: h => h(App) }).$mount('#app')` 为例。

这里我们同样直接跳过 Vue 实例化的过程，你只需要知道 Vue 将我们传入的 options 和默认 Vue.options 通过一定的合并策略进行合并，并挂载到 vm.$options 上。

mount 方法的执行和模版到视图的过程相同，同样会调用 `vm._update(vm._render(), hydrating)`

### vm.\_render() 生成 vnode

**createElement 也就对应 render 函数中的 h**

```ts
export function _createElement(
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
  let vnode, ns
  if (typeof tag === 'string') {
    // ...
  } else {
    // tag 是一个组件对象，调用 createComponent 创建组件 vnode
    vnode = createComponent(tag, data, context, children)
  }

  return vnode
}
```

**createComponent**

```ts
export function createComponent(
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  // baseCtor === Vue
  const baseCtor = context.$options._base

  // 通过 Vue.extend 将组件对象转化成一个组件构造器
  // Ctor 和 Vue 拥有相同的能力，并且持有组件信息
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }

  data = data || {}

  // 在 data 上挂在组件相关的钩子，这些钩子会在特定时机执行
  // 钩子：init prepatch insert destroy
  // data.hooks = { init, prepatch, insert, destroy }
  installComponentHooks(data)

  const name = Ctor.options.name || tag
  // 创建组件 vnode，它的名字比较特殊
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data,
    undefined,
    undefined,
    undefined,
    context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )

  // 返回组件 vnode
  return vnode
}
```

总结：组件对应的是一个大的组件 VNode，它普通的 VNode 不同。它拥有一些特殊的属性，如 data.hooks、Ctor、propsData 等。

### 组件 VNode 的 patch 过程

**patch**

```ts
function patch(oldVnode, vnode, hydrating, removeOnly) {
  // oldVnode 是一个真实的节点
  if (isUndef(oldVnode)) {
    // ...
  } else {
    const isRealElement = isDef(oldVnode.nodeType)
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      // ...
    } else {
      if (isRealElement) {
        // #app 转化成 vnode，且将 #app 真实节点挂在到 vnode.elm 上
        oldVnode = emptyNodeAt(oldVnode)
      }

      const oldElm = oldVnode.elm
      const parentElm = nodeOps.parentNode(oldElm) // body 节点

      // 创建真实 DOM
      createElm(
        vnode,
        insertedVnodeQueue,
        // extremely rare edge case: do not insert if old element is in a
        // leaving transition. Only happens when combining transition +
        // keep-alive + HOCs. (#4590)
        oldElm._leaveCb ? null : parentElm,
        nodeOps.nextSibling(oldElm)
      )

      // 移除 #app 节点
      if (isDef(parentElm)) {
        removeVnodes([oldVnode], 0, 0)
      } else if (isDef(oldVnode.tag)) {
        invokeDestroyHook(oldVnode)
      }
    }
  }

  return vnode.elm
}
```

**createElm**

```ts
function createElm(
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
  nested,
  ownerArray,
  index
) {
  // ...
  // createComponent 返回 true，当 vnode 是真实节点下
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return
  }
  // ...
}
```

**createComponent**

```ts
function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data
  if (isDef(i)) {
    if (isDef((i = i.hook)) && isDef((i = i.init))) {
      // 拿到组件 vnode 上的 data.hooks.init 钩子并且执行
      i(vnode, false /* hydrating */)
    }

    // 执行完 vnode.data.hooks.init 钩子后执行（暂且忽略这些逻辑）
    // 我们先看完 init 钩子执行逻辑
    if (isDef(vnode.componentInstance)) {
      initComponent(vnode, insertedVnodeQueue)
      insert(parentElm, vnode.elm, refElm)
      if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
      }
      return true
    }
  }
}
```

**componentVnode.data.hooks.init**

```ts
const componentVNodeHooks = {
  init(vnode: VNodeWithData, hydrating: boolean): ?boolean {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // ...
      // keep-alive 相关逻辑
    } else {
      // 这里拿到 componentVnode.Ctor 进行组件的实例化
      const child = (vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      ))
      // 然后手动调用组件实例的 $mount 方法
      // 这里的 hydrating 和 ssr 相关，这里是 false
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  },
}
```

**组件实例调用 $mount**

- `$mount` 方法会调用 `mountComponent` 方法
- `mountComponent` 方法会调用 `vm._update(vm._render(), hydrating)` 方法。
- `vm._render()` 生成组件内部模版的 VNode
- 然后调用 `vm._update(vm._render())`

```ts
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this

  // prevVnode 空的，首次渲染
  if (!prevVnode) {
    // 这里的 vm.$el 为空，组件实例内部调用 $mount(undefined)
    // 将创建好的 dom 挂在到 componentInstance.$el 上
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
  } else {
    // ...
    // 组件更新逻辑
  }
}
```

**patch**

```ts
return function patch(oldVnode, vnode, hydrating, removeOnly) {
  // oldVnode 为空
  if (isUndef(oldVnode)) {
    // 执行 createElm 将所有的 vnode 转化成真实 dom
    // 组件内部的模版全部被渲染成真实的 dom，但是没有进行挂载
    createElm(vnode, insertedVnodeQueue)
  } else {
    // ...
  }

  // 返回创建好的真实 dom
  return vnode.elm
}
```

到此，componentVnode.data.hooks.init 钩子执行完成。下面我们回到原来函数中去

**createComponent**

```ts
function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data
  if (isDef(i)) {
    if (isDef((i = i.hook)) && isDef((i = i.init))) {
      i(vnode, false /* hydrating */)
    }

    // init 钩子执行完成，组件完成实例化
    if (isDef(vnode.componentInstance)) {
      // initComponent 重要逻辑：
      // vnode.elm = vnode.componentInstance.$el;
      initComponent(vnode, insertedVnodeQueue)
      // 此时 vnode.elm 上存在渲染好的真实 dom
      // 完成插入操作，至此页面上出现视图
      insert(parentElm, vnode.elm, refElm)
      return true
    }
  }
}
```

组件渲染总结：

- 渲染发现组件节点
- 创建 componentVnode，组件 vnode 上存在组件构造器和 hooks，以及一些其他不同于普通 vnode 的属性
- 然后进入 patch 中，发现是 componentVnode 时，便会调用 componentVnode.data.hooks.init 钩子
- init 钩子会通过组件构造器实例化组件，并且手动执行 $mount 方法，并且传入 undefined。
- $mount 方法会调用组件的 render 函数生成 vnode，并且通过 patch 方法将它渲染成真实的 dom，但并不会将其插入到页面中，因为 init 钩子在手动调用 $mount 方法是并没有指定 oldVnode，而是传了 undefined。
- init 钩子执行完成之后。此时的组件已经完成了实例化和组件内部元素的渲染，这时 vue 会将渲染好的元素挂载到 componentVnode.elm 上，并且将它插入到页面中去。

## 组件注册原理

#### 原理

组件注册的原理其实非常简单，我们上面了解到组件渲染其实就是将组件对象转化成一个 componentVnode，然后再通过 patch 转化成真实的 DOM。

所以我们不妨大胆的猜测一下，组件注册是不是就是通过 key/value 的形式将组件和组件名称建立一个映射关系。渲染过程中如果发现 vnode.tag 命中组件名，那么取出对应的组件对象就创建 componentVnode。至于局部组件和全局组件，无非就是控制一下这个映射关系的作用范围就行了 🎉 是不是觉得组件注册也不过如此。

### 全局注册

```ts
// ASSET_TYPES = ['component', 'directive', 'filter']
// 这里我们只关系 Vue.component
ASSET_TYPES.forEach((type) => {
  Vue[type] = function (
    id: string,
    definition: Function | Object
  ): Function | Object | void {
    if (type === 'component' && isPlainObject(definition)) {
      definition.name = definition.name || id
      // 通过 Vue.extend 将组件对象转化成组件构造器 Ctor
      definition = this.options._base.extend(definition)
    }

    // 将组件构造器挂载到 Vue.options.components[cmpName] 上
    this.options[type + 's'][id] = definition
    // 返回组件构造器
    return definition
  }
})
```

可以看到当我们通过 `Vue.component('my-cmp', MyCmp)` 这种方式注册组件后，vue 会将组件对象转化成组件构造器，并且将它挂到 `Vue.options.component['my-cmp']` 上。

下面我们了解一下 Vue 的实例化

```ts
function Vue(options) {
  // ...
  // 调用 _init 方法
  this._init(options)
}

Vue.prototype._init = function (options?: Object) {
  const vm: Component = this

  // ...
  if (options && options._isComponent) {
    // ... 组件合并 options
  } else {
    // 这里 resolveConstructorOptions 将会返回 Vue.options
    // mergeOptions 会将 Vue.options 和 userOptions 进行合并，并且将合并结果挂载到 vm.$options 上
    // 所以现在可以通过 vm.$options.components 访问到我们注册的组件
    vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor), // Vue.options
      options || {}, // 我们传入的 options
      vm
    )
  }
  // ...
}
```

知道了 vue 是如何缓存注册好的组件后，我们进入渲染环节。提到渲染就离不开 `createElement` 函数，所有的 vnode 都是通过它来创建的。

**createElement**

```ts
export function _createElement(
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
  let vnode, ns
  if (typeof tag === 'string') {
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    if (config.isReservedTag(tag)) {
      // ...
      // 普通 vnode
    } else if (
      (!data || !data.pre) &&
      // resolveAsset 会在解析 vm.$options 和 tag 命中的组件
      isDef((Ctor = resolveAsset(context.$options, 'components', tag)))
    ) {
      // 命中组件，拿到 Ctor 创建组件 vnode
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      // 空文本 vnode
      vnode = new VNode(tag, data, children, undefined, undefined, context)
    }
  } else {
    // tag 不是 string，创建组件 vnode（组件对象）
    vnode = createComponent(tag, data, context, children)
  }

  return vnode
}
```

总结：组件注册先将组件对象转化成组件构造器，并将生成好的组件构造器挂载到 Vue.options.components 上，然后在所有的组件实例化过程中将 Vue.options 合并到实例的 vm.$options 中。等到组件开始调用 $mount 挂载创建 vnode 时，如果发现 tag 命中 vm.$options.components 中的组件，就会创建组件 vnode 渲染组件。这也是为什么组件注册一定要在 Vue 实例化之前。

## 异步组件原理

**原理**

异步组件的原理其实也非常简单，当 `vue` 在创建组件 vnode 的过程中发现组件是一个异步组件时，就会创建一个注释节点 vnode 用来给异步组件占位置，而这个注释节点会在首次渲染时和其他的 vnode 一起渲染成真实的 dom 插入到页面上。等到异步组件加载完成之后，`vue` 调用 `$forceUpdate` 方法强制重新渲染，这个时候渲染到组件 vnode 时已经拿到了组件对象，然后正常走组件渲染逻辑。

**代码**

```ts
export function createComponent(
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  const baseCtor = context.$options._base // this.$options._base

  // 异步组件 Ctor 是个函数，跳过此逻辑
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }

  // async component
  let asyncFactory
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor
    // 异步组件有多种方式可以定义，这里我们以动态导入 import('xxxx.vue') 为例
    // resolveAsyncComponent 方法会调用 Ctor 函数，也就是动态导入 xxx.vue
    // 在不考虑高级异步组件的情况下 Ctor 会是一个 undefined （高级异步组件可能存在 loading 选项)
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor)
    if (Ctor === undefined) {
      // 创建一个占位 vnode
      return createAsyncPlaceholder(asyncFactory, data, context, children, tag)
    }
  }
  // ...
}
```

**resolveAsyncComponent**

```ts
export function resolveAsyncComponent(
  factory: Function, // 工厂函数
  baseCtor: Class<Component>
): Class<Component> | void {
  // 当前组件实例
  const owner = currentRenderingInstance
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // 将当前组件实例存入 factory.owners 中
    factory.owners.push(owner)
  }

  if (owner && !isDef(factory.owners)) {
    const owners = (factory.owners = [owner])
    let sync = true

    // 执行 () => import('xxx.vue') 返回加载组件的 promise
    const res = factory(resolve, reject)

    if (isObject(res)) {
      if (isPromise(res)) {
        if (isUndef(factory.resolved)) {
          // 执行 promiseInstance.then 方法异步获取组件对象，这里传入 vue 定义的 resolve 函数
          res.then(resolve, reject)
        }
      } else if (isPromise(res.component)) {
        // 高级异步组件逻辑
        // ...
      }
    }

    sync = false
    // 返回 factory.resolved，首次为 undefined
    return factory.loading ? factory.loadingComp : factory.resolved
  }
}

// 异步组件加载完成，执行 resolve 函数
const resolve = once((res: Object | Class<Component>) => {
  // 拿到异步加载成功的组件对象，并挂载到 factory.resolved
  // ensureCtor 会对异步加载做兼容处理，并且将组件对象转化为组件构造器
  factory.resolved = ensureCtor(res, baseCtor);
  // 执行 forceRender
  forceRender(true);
});

const forceRender = (renderCompleted: boolean) => {
  for (let i = 0, l = owners.length; i < l; i++) {
    // 遍历 factory.owners，重新渲染内部具有异步组件的组件
    (owners[i]: any).$forceUpdate();
  }
};

// 组件的第二次渲染
export function resolveAsyncComponent(
  factory: Function,
  baseCtor: Class<Component>
): Class<Component> | void {
  // 直接返回之前加载并处理好的组件构造器
  if (isDef(factory.resolved)) {
    return factory.resolved;
  }
}
```
