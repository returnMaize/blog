## 介绍

当组件中的响应式数据发生变化时，便会触发组件的重新渲染，但如果每次重新渲染都需要重新创建所有 DOM，那将会是非常损耗性能的，毕竟每一个 DOM 元素都是昂贵的。这时就需要一个算法，它能够通过比对新老 VNode，知道应该创建那些 DOM 元素，应该复用那些 DOM 元素。毕竟大多数响应式数据的变化都只会影响很小视图变化。而这个用来比对新老 VNode 的算法就称为 diff 算法。

**组件更新**

组件更新调用的是 `vm._update(vm._render(), hydrating)`，其中 `vm._render()` 用于生成新的 VNode，这和首次创建 VNode 并无不同，所以我们重点关注 `vm._update(newVNode)` 逻辑

```ts
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this
  const prevEl = vm.$el
  // prevVnode 为 oldVnode，存在 Vnode.elm 属性，对应真实 DOM
  const prevVnode = vm._vnode

  // vnode 为 newVnode，elm 属性为空
  vm.$el = vm.__patch__(prevVnode, vnode)
}

return function patch(oldVnode, vnode, hydrating, removeOnly) {
  if (isUndef(oldVnode)) {
    // ...
  } else {
    // oldVNode 是一个虚拟元素
    const isRealElement = isDef(oldVnode.nodeType)
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      // 是虚拟元素且根节点是相同元素（这里我们只考虑根节点相同情况，日常开发也很少会修改组件根节点）
      patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
    } else {
      // 如果根节点不相同，那么组件更新将重新创建所有元素，这将不会存在任何优化
      // 所以建议日常开发过程中，不要修改组件根节点
    }
  }

  // 返回更新好的 DOM
  return vnode.elm
}

function patchVnode(
  oldVnode,
  vnode,
  insertedVnodeQueue,
  ownerArray,
  index,
  removeOnly
) {
  // 将老 DOM 赋值给新 DOM，此时 newVnode.elm 拥有了原来的 DOM
  const elm = (vnode.elm = oldVnode.elm)

  // 拿到新老 vnode 的 children
  const oldCh = oldVnode.children
  const ch = vnode.children

  // 这里我们只考虑都存在 children 的情况，并且新老 children 不一样
  // updateChildren 便是 vue 中的 diff 算法
  updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
}
```

**updateChildren**

![diff 算法](/img/diff.png)

**diff 算法比对流程**

- 头 和 头 比对（相同进行 vnode 赋值）
- 尾 和 尾 比对（相同进行 vnode 赋值）
- 旧头 和 新尾 比对（相同进行 vnode 赋值操作，然后将真实 dom 移过去）
- 旧尾 和 新头 比对（相同进行 vnode 赋值操作，然后将真实 dom 移过去）
- 通过新头的 key 找到对应的真实旧节点位置（相同进行 vnode 赋值操作，然后将真实 dom 移过去，然后老的节点赋值成 undefined，下次循环的这个节点时会直接跳过）
- 判断是否相同节点去老的节点列表中去找（相同进行 vnode 赋值操作，然后将真实 dom 移过去，然后老的节点赋值成 undefined，下次循环的这个节点时会直接跳过）
- 相同 key，单节点不同。或则没有找到相同节点。那么就进行新建真实节点到新头
- 最后比对 oldStartIdx 和 oldEndIdx。如果新的比老的多，就新增没有创建的真实节点。如果新的比老的少，那么就把多余的真实节点全部删掉
