## 介绍

我们可以将 vue 中的事件分为两大类（原生事件和自定义事件）

### 原生事件

**普通元素上的原生事件**

```vue
<div @click="handleClick"></div>
```

**组件上的原生事件**

```vue
<child @click.native="handleClick" />
```

### 自定义事件

自定义事件只能存在于组件中

**自定义事件**

```vue
<child @data-change="onDataChange" />
```

我们首先来看原生事件

## 原生事件

### 编译环节

我们编写以下模版来分析 vue 是如何处理原生事件的

```vue
<button @click="onBtnClick">btn</button>

<child @click.native="onChildComponentClick" />
```

模版编译后的代码（使用脚手架开发时，vue-cli 会在项目启动时通过 vue-loader 将模版编译成 render 函数）

```js
var render = function render() {
  var _vm = this,
    _c = _vm._self._c
  return _c(
    'div',
    [
      _c('button', { on: { click: _vm.onBtnClick } }, [_vm._v('btn')]),
      _c('child', {
        nativeOn: {
          click: function ($event) {
            return _vm.onChildComponentClick.apply(null, arguments)
          },
        },
      }),
    ],
    1
  )
}
```

可以看到 vue 会将普通元素上的事件挂载到 vnode.data.on 上，将组件中的原生事件挂载到 componentVnode.data.nativeOn 上。

这里我们标记一下，vue 编译环节对对原生事件的处理。

- 普通元素：vnode.data.on
- 组件原生事件：vnode.data.nativeOn

### 运行时处理

**普通元素**

我们先看普通元素运行时事件处理

```js
// 在将 vnode 转化为真实 dom 后，vue 会调用 invokeCreateHooks 方法
function createElm(
  vnode,
  insertedVnodeQueue,
  parentElm?: any,
  refElm?: any,
  nested?: any,
  ownerArray?: any,
  index?: any
) {
  // ...
  // 通过 vnode 创建 dom
  vnode.elm = vnode.ns
    ? nodeOps.createElementNS(vnode.ns, tag)
    : nodeOps.createElement(tag, vnode)

  if (isDef(data)) {
    // 触发 create 钩子
    invokeCreateHooks(vnode, insertedVnodeQueue)
  }
}

// invokeCreateHooks 方法会调用 cbs.create
// cbs 的初始化发生在 patch 函数生成时，感兴趣可以自己去看一下
function invokeCreateHooks(vnode, insertedVnodeQueue) {
  for (let i = 0; i < cbs.create.length; ++i) {
    cbs.create[i](emptyNode, vnode)
  }
}

// cbs.create 最终调用的其实是 updateDOMListeners 方法
function updateDOMListeners(oldVnode: VNodeWithData, vnode: VNodeWithData) {
  // ...
  const on = vnode.data.on || {}
  const oldOn = oldVnode.data.on || {}

  // 拿到元素的真实 dom
  target = vnode.elm || oldVnode.elm
  // updateListeners 会移除老的事件，添加新的事件。最终会调用 add 方法
  updateListeners(on, oldOn, add, remove, createOnceHandler, vnode.context)
  target = undefined
}

function add(
  name: string,
  handler: Function,
  capture: boolean,
  passive: boolean
) {
  // 通过 addEventListener 给真实 dom 添加事件
  target.addEventListener(
    name,
    handler,
    supportsPassive ? { capture, passive } : capture
  )
}
```

**普通元素事件总结**

- 编译时：将事件编译到 vnode.data.on 中
- 运行时：创建完 dom 后调用 invokeCreateHooks 触发 create 钩子，create 钩子会调用 updateDOMListeners 根据 vnode.data.on 上的事件调用 addEventListener 将事件添加到 dom 上。

**组件上的自定义事件**

```js
// 组件构造器初始化时
export function createComponent(
  Ctor: typeof Component | Function | ComponentOptions | void,
  data: VNodeData | undefined,
  context: Component,
  children?: Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  // ...

  // 将 nativeOn 赋值给 data.on
  data.on = data.nativeOn
  // 创建组件 vnode
  const vnode = new VNode(
    // @ts-expect-error
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data,
    undefined,
    undefined,
    undefined,
    context,
    // @ts-expect-error
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )
  return vnode
}

// 组件 patch 过程
function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data
  if (isDef(i)) {
    // componentVnode.hook.init 实例化组件
    if (isDef((i = i.hook)) && isDef((i = i.init))) {
      i(vnode, false /* hydrating */)
    }

    if (isDef(vnode.componentInstance)) {
      // 调用 initComponent
      initComponent(vnode, insertedVnodeQueue)
      // 将组件插入到页面中
      insert(parentElm, vnode.elm, refElm)
      return true
    }
  }
}

// 此时组件已经渲染完成，拥有正式节点，但未插入到页面
function initComponent(vnode, insertedVnodeQueue) {
  // 拿到组件根元素（正式节点）
  vnode.elm = vnode.componentInstance.$el
  if (isPatchable(vnode)) {
    // 调用 invokeCreateHooks 执行 create 钩子
    invokeCreateHooks(vnode, insertedVnodeQueue)
    setScope(vnode)
  }
}

// create 钩子会执行 updateDOMListeners 钩子
function updateDOMListeners(oldVnode: VNodeWithData, vnode: VNodeWithData) {
  // ...
  const on = vnode.data.on || {}
  const oldOn = oldVnode.data.on || {}

  // vnode.elm 就是组件的根元素（真实节点）
  target = vnode.elm || oldVnode.elm
  // updateListeners 会移除老的事件，添加新的事件。最终会调用 add 方法
  updateListeners(on, oldOn, add, remove, createOnceHandler, vnode.context)
  target = undefined
}

function add(
  name: string,
  handler: Function,
  capture: boolean,
  passive: boolean
) {
  // 通过 addEventListener 给组件根元素添加事件
  target.addEventListener(
    name,
    handler,
    supportsPassive ? { capture, passive } : capture
  )
}
```

**组件原生事件总结**

- 编译：将事件编译到 componentVnode.data.nativeOn 中
- 运行时：
  - 创建组件 vnode：初始化子组件构造器会将 data.nativeOn 赋值给 data.on 然后创建组件 vnode。（这里我们可以发现，只要是原生事件，vue 最终都会将它放到 vnode.data.on 中）。
  - patch 组件：调用 componentVnode.hook.init 实例化自组件和完成组件模版的 patch 流程，调用 initComponent 方法初始化组件，initComponent 方法会在组件插入到页面前调用 invokeCreateHooks 方法，触发 create 钩子，create 钩子会根据 componentVnode.data.on 将事件挂载到组件的根元素上。

## 自定义事件

### 编译

**模版**

```vue
<child @data-change="onDataChange" />
```

**编译结果**

```js
var render = function render() {
  var _vm = this,
    _c = _vm._self._c
  return _c(
    'div',
    [_c('child', { on: { 'data-change': _vm.onDataChange } })],
    1
  )
}
```

和普通元素事件一样，自定义事件会被挂载到 vnode.data.on 上

### 运行时

组件 vnode 创建过程

```js
export function createComponent(
  Ctor: typeof Component | Function | ComponentOptions | void,
  data: VNodeData | undefined,
  context: Component,
  children?: Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  // ...

  // 我们已经知道组件上的原生事件会被挂载到 data.nativeOn 上
  // 而组件上的自定义事件会被挂载到 data.on 上
  // 拿到自定义事件
  const listeners = data.on
  // 将原生事件赋值给 data.on
  data.on = data.nativeOn

  // 组件中的原生事件会被添加到 componentVnode.data.on 上
  // 组件中的自定义事件会被添加到 componentVnode.componentOptions.listeners 上
  const vnode = new VNode(
    // @ts-expect-error
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data,
    undefined,
    undefined,
    undefined,
    context,
    // @ts-expect-error
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )

  return vnode
}
```

组件实例化过程

```js
Vue.prototype._init = function (options?: Record<string, any>) {
  // ...

  // 将组件上的自定义事件挂载到 $options._parentListeners 上
  if (options && options._isComponent) {
    initInternalComponent(vm, options as any)
  }

  initEvents(vm)
}

export function initInternalComponent(
  vm: Component,
  options: InternalComponentOptions
) {
  const opts = (vm.$options = Object.create((vm.constructor as any).options))

  // 将组件上的自定义事件挂载到 $options._parentListeners 上
  opts._parentListeners = vnodeComponentOptions.listeners
}

export function initEvents(vm: Component) {

  // 拿到组件上的自定义事件
  const listeners = vm.$options._parentListeners
  if (listeners) {
    // 执行 updateComponentListeners
    updateComponentListeners(vm, listeners)
  }
}

export function updateComponentListeners(
  vm: Component,
  listeners: Object,
  oldListeners?: Object | null
) {
  target = vm
  // 遍历 listeners，执行 add
  updateListeners(
    listeners,
    oldListeners || {},
    add,
    remove,
    createOnceHandler,
    vm
  )
  target = undefined
}

function add(event, fn) {
  // 给组件实例通过 $on 添加事件
  target.$on(event, fn)
}
```

**自定义事件总结**

- 编译：自定义事件会被编译到 componentVnode.data.on 上
- 运行时：
  - 组件 vnode 创建前：将原生事件挂载到 componentVnode.data.on 上，将自定义事件挂载到 componentVnode.componentOptions.listener 上
  - 组件实例化时：调用 updateListeners 将 componentVnode.componentOptions.listener 上所有事件通过 $on 方法进行监听
