## 原理

在使用 `vue` 开发项目时，我们只需要在单文件 `.vue` 中编写 `template` 语法，`vue` 就会自动将模版渲染成视图。这期间 `vue` 究竟做了什么，使得浏览器可以认识 `template` 语法呢。

**原理揭秘：**

- 首先我们日常开发接触最多的都是单文件 `.vue`，我们会在 `.vue` 中编写 `template` 板块，它也将成为我们的视图部分。在我们使用本地开发服务器启动项目时，`vue-loader` 其实会将 `.vue` 中的 `template` 模版转化成 `render` 函数，如果你还不了解什么是 `render` 函数，可以通过阅读 [vue docs](https://cn.vuejs.org/guide/extras/render-function.html#creating-vnodes) 进行了解
- 在 `vue` 项目的入口文件 `main.js` 中，我想你对这行代码并不陌生 `new Vue({ render: h => h(App) }).$mount('#app')`。它调用一个名为 `$mount` 的方法，这个方法就是用来将模版渲染为视图的方法
- `$mount` 内部会执行 `vm._update(vm._render(), hydrating)`。这里的 `vm._render()` 执行的就是模版对应的渲染函数，它将会为我们生成对应模版的 VNode，`vm._update` 就是用来将 VNode 转化成真实的 DOM。

:::tip
这里你可能还没了解过什么是 VNode，你可以理解成它是一个 JavaScript 对象，它用来对一个真实的 DOM 节点进行描述
:::

## 源码分析

为了不增加过的的阅读负担，以下回省略很多无关紧要的源码方便阅读。在阅读源码之前，我们需要带着两个核心点去阅读。

- `vue` 是如何通过渲染函数生成 VNode
- `vue` 是如果将 VNode 转化成真实的 DOM 节点

### 1. render => VNode

**$mount**

```ts
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  // 通过 el 拿到真实的 DOM 节点。（一般是 $mount('#app') 拿到 #app 对应的真实节点）
  el = el && inBrowser ? query(el) : undefined
  // 执行 mountComponent
  return mountComponent(this, el, hydrating)
}
```

**mountComponent**

```js
export function mountComponent(
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  // 执行 beforeMount 钩子
  callHook(vm, 'beforeMount')
  // 定义 updateComponent 方法，此方法用于将 vnode 转化成真实 dom
  updateComponent = () => {
    vm._update(vm._render(), hydrating)
  }

  // 渲染 Watcher，跟响应式强相关。这里我们知道它在实例化中回调用一次 updateComponent
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
  hydrating = false

  // 执行完 updateComponent，完成视图渲染，执行 mounted 钩子
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```

接下来我们重点关注 `vm._render()` 方法，它将会生成我们模版对应的 VNode

**vm.\_render()**

```ts
Vue.prototype._render = function (): VNode {
  const vm: Component = this
  // 拿到模版对应的 render 函数，该函数会在实例化 Vue 时被挂在到 $options 上
  const { render, _parentVnode } = vm.$options
  // 执行 render 函数，并传入 createElement，这个函数就是我们日常开发常见的 h 函数
  // h 函数就是用来创建单独的 Vnode
  vnode = render.call(vm._renderProxy /* vm */, vm.$createElement)
  // 返回创建好的 VNode，准确的说时 VNode tree
  return vnode
}
```

假设我们渲染函数如下（我们手写的渲染函数和 `vue-loader` 自动生成的渲染函数有一定的差异性，这是因为它给我们做了一些优化操作）

```
// 这里为了不增加复杂度，我们仅渲染一个 ul 和 3 个 li 元素
const render = h => h('ul', [h('li', 1), h('li', 2), h('li', 3)])
```

假设以上渲染函数就是 `vue-loader` 将我们 `template` 转化成渲染函数后的样子，可以看到渲染函数本质是通过 h 函数去生成 vnode，这里的 h 函数就是 `vue` 传入的 `vm.$createElemnt`

**vm.$createElemnt**

```ts
// 初始化
vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)

export function createElement(
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  // 这里就是做了一层参数的重载，因为 data 参数是可选值，如果 data 没有传，vue 就会将参数往后移一位
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE
  }
  // 调用 _createElement
  return _createElement(context, tag, data, children, normalizationType)
}

export function _createElement(
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
  let vnode, ns
  // createElement 既可以接受组件对象又可以接受一个字符 tag
  if (typeof tag === 'string') {
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    if (config.isReservedTag(tag)) {
      // 如果 tag 是一个符合规范的 html 标签，那么直接生成对应的 vnode，就是一个 js 对象
      // 注意：这里的 children 用来建立父子关系实现 vnode tree
      vnode = new VNode(
        config.parsePlatformTagName(tag),
        data,
        children,
        undefined,
        undefined,
        context
      )
    } else if (
      (!data || !data.pre) &&
      isDef((Ctor = resolveAsset(context.$options, 'components', tag)))
    ) {
      // 如果 tag 刚好命中了注册好组件的 tag，那么就会创建一个组件 vnode
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      // 如果都没有命中，创建一个空的文本 vnode
      vnode = new VNode(tag, data, children, undefined, undefined, context)
    }
  } else {
    // 传入的 tag 不是一个字符，是组件对象。那么创建一个组件 vnode
    vnode = createComponent(tag, data, context, children)
  }

  // 返回创建好的 vnode
  return vnode
}
```

总结：可以看到，render 函数就是通过不断调用 `createElement` 生成 vnode，并通过 children 这个参数维持不同节点间的父子结构，从而生成对应 `template` 的 `vnode tree`

### 2. VNode => DOM

有了 vnode，我们再来看看 vue 是如何通过 `vm._update(vm._render(), hydrating)` 将 vnode 转化成真实 DOM 的。

**vm.\_update(vm.\_render())**

```ts
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  if (!prevVnode) {
    // 首次渲染
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
  } else {
    // 组件更新
    vm.$el = vm.__patch__(prevVnode, vnode)
  }
}

Vue.prototype.__patch__ = inBrowser ? patch : noop

// 函数柯里化，利用闭包实现对 nodeOps 和 modules 的持有
// nodeOps 和 modules 是平台相关的代码和操作 node 节点的 api
export const patch: Function = createPatchFunction({ nodeOps, modules })
```

**createPatchFunction**

```ts
export function createPatchFunction(backend) {
  // ...
  // 上面有一坨辅助函数

  return function patch(oldVnode, vnode, hydrating, removeOnly) {
    const isRealElement = isDef(oldVnode.nodeType)
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      // ...
      // 组件更新逻辑（diff 算法）
    } else {
      // 首次渲染
      if (isRealElement) {
        // 此时 oldVnode 就是真实的 #app 节点
        // 将真实的 #app 节点转化成 vnode，且将真实节点挂到 vnode.elm 上
        oldVnode = emptyNodeAt(oldVnode)
      }

      // 拿到真实节点 #app
      const oldElm = oldVnode.elm
      // 拿到 #app 的父真实节点（一般是 body）
      const parentElm = nodeOps.parentNode(oldElm)

      // 通过 vnode 创建真实 dom
      createElm(
        vnode, // 模版对应的 vnode
        insertedVnodeQueue,
        // extremely rare edge case: do not insert if old element is in a
        // leaving transition. Only happens when combining transition +
        // keep-alive + HOCs. (#4590)
        oldElm._leaveCb ? null : parentElm, // 父真实节点 body
        nodeOps.nextSibling(oldElm) // 下一个兄弟节点（参考节点）
      )

      // 创建并挂载完真实的 dom 之后，会移除掉原来的挂在节点 #app。
      // 这是为什么不要将 body 元素作为挂在节点的原因。
      if (isDef(parentElm)) {
        removeVnodes([oldVnode], 0, 0)
      } else if (isDef(oldVnode.tag)) {
        invokeDestroyHook(oldVnode)
      }
    }

    return vnode.elm
  }
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
  const data = vnode.data
  const children = vnode.children
  const tag = vnode.tag
  // 判断 vnode 是否存在 tag
  if (isDef(tag)) {
    // 根据 tag 创建出对应的真实节点（如 div、ul、span ...）
    vnode.elm = vnode.ns
      ? nodeOps.createElementNS(vnode.ns, tag)
      : nodeOps.createElement(tag, vnode)
    setScope(vnode)

    /* istanbul ignore if */
    if (__WEEX__) {
      // weex 平台相关
    } else {
      // 创建出所有的子元素（createChildren 内部遍历 children 递归执行 createElm）
      createChildren(vnode, children, insertedVnodeQueue)
      // 当所有的子节点都完成创建之后开始插入
      // 这里我们就能够得知创建是先父后子，插入是先子后父
      insert(parentElm, vnode.elm, refElm)
    }
  } else if (isTrue(vnode.isComment)) {
    // vnode 是一个注释节点，创建一个真实的注释节点
    vnode.elm = nodeOps.createComment(vnode.text)
    // 将注释节点插入到 body 中，#app 的后面
    insert(parentElm, vnode.elm, refElm)
  } else {
    // 创建一个真实的空节点
    vnode.elm = nodeOps.createTextNode(vnode.text)
    // 插入到 body 中，#app 的后面
    insert(parentElm, vnode.elm, refElm)
  }
}
```

总结：vue 通过 vnode 创建 dom 的过程中，首先会将父元素进行创建。如果发现其有子元素，那么会继续创建子元素。如果子元素还有子元素，就会一直通过递归的方式创建到最后一个子元素，直到没有子元素为止。等到所有的子元素都完成创建之后，便会从子到父完成插入操作。这也是为什么在 vue 中，元素的创建是先父后子，插入是先子后父的原因。
