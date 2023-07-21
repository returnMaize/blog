## 依赖收集

阅读到本章，我想你应该知道了 `2.x` 计算属性的实现原理和了解 `3.x` 中的响应式原理，如果你还不了解，那你应该先去阅读它们。

**源码**

```ts
export function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>
) {
  let getter: ComputedGetter<T>
  let setter: ComputedSetter<T>

  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions
    setter = __DEV__
      ? () => {
          console.warn('Write operation failed: computed value is readonly')
        }
      : NOOP
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  // 这里我们只考虑 getter 情况，大多数情况下计算属性都是用来求值用的。
  return new ComputedRefImpl(
    getter, // 用户传入的计算函数 computed(fn), fn === getter
    setter,
    isFunction(getterOrOptions) || !getterOrOptions.set
  ) as any
}

class ComputedRefImpl<T> {
  private _value!: T
  private _dirty = true

  public readonly effect: ReactiveEffect<T>

  public readonly __v_isRef = true
  public readonly [ReactiveFlags.IS_READONLY]: boolean

  constructor(
    getter: ComputedGetter<T>,
    private readonly _setter: ComputedSetter<T>,
    isReadonly: boolean
  ) {
    // 将 getter 包装成 effect 函数，为了之后理解我们称它为 computedEffect
    this.effect = effect(getter, {
      lazy: true, // lazy 为 true 表示调用 effect 的调用不会立即执行 getter 函数进行计算
      scheduler: () => {
        // scheduler 调度函数，在 getter 中响应式数据发生变化时执行
        if (!this._dirty) {
          // 将 dirty 赋值为 true
          this._dirty = true
          // 通知依赖该计算属性的 effect 函数
          trigger(toRaw(this), TriggerOpTypes.SET, 'value')
        }
      },
    })
  }

  get value() {
    // 访问计算属性时触发
    if (this._dirty) {
      // 通过 _dirty 判断计算属性依赖的数据是否已经脏了，从而决定是否重新计算，初始化时为 true
      this._value = this.effect()
      // 计算完成 _dirty 赋值为 false
      this._dirty = false
    }
    // 依赖收集，如果此时在创建组件 vnode 时访问计算属性，则会收集当前组件的 componentEffect
    track(toRaw(this), TrackOpTypes.GET, 'value')
    // 返回求值结果，如果 dirty 是 false 时，值直接返回，不需要重复计算
    return this._value
  }

  set value(newValue: T) {
    // ...
  }
}
```

**依赖收集总结**

- 计算属性在初始化过程中并不会进行计算，也就是当我们通过 `computed(getter)` 定义一个属性时。这点和 2.x 并无区别。
- 当我们在模版中使用计算属性时，在创建模版 vnode 时会访问到计算属性触发取值函数 get，这时 vue 会根据 dirty 字段决定是否需要调用 getter 函数进行求值，dirty 在初始化的计算属性中为 true，首次访问必定进行求值。求值前会将 computedEffect 作为 activeEffect，然后调用 getter 函数进行求值，这时会访问到 getter 函数中的响应式数据触发 proxy.get，响应式数据收集 computedEffect 作为依赖。求值完成后移除 computedEffect，此时的 activeEffect 将变成 componentEffect，然后计算属性会调用 `track` 将 componentEffect 作为依赖收集起来。

**简单总结（组件模版中的 computed）**

- 计算属性中的响应式数据会收集 computedEffect
- 计算属性会收集 componentEffect

## 派发更新

这里以模版中的计算属性为例分析

当计算属性中的响应式数据发生变化时，首先会通知 computedEffect，computedEffect 会将 dirty 赋值为 true，然后调用 trigger 函数通知依赖该计算属性的 effect 函数，也就是 componentEffect，这时组件会重新渲染，然后又会访问到这个计算属性，此时的计算属性 \_dirty 为 true，计算属性重新计算得到新值返回。

**源码**

```ts
// 计算属性中的响应式数据调用 trigger 通知 computedEffect
export function trigger(
  target: object,
  type: TriggerOpTypes,
  key?: unknown,
  newValue?: unknown,
  oldValue?: unknown,
  oldTarget?: Map<unknown, unknown> | Set<unknown>
) {
  const depsMap = targetMap.get(target)

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
  // 拿到需要通知的 effect 函数
  depsMap.forEach(add)

  const run = (effect: ReactiveEffect) => {
    // 调用 computed effect 函数专属 scheduler
    if (effect.options.scheduler) {
      effect.options.scheduler(effect)
    } else {
      // ...
    }
  }

  // 通知 effect
  effects.forEach(run)
}

// 通知 computed effect
this.effect = effect(getter, {
  lazy: true,
  // 执行 scheduler
  scheduler: () => {
    if (!this._dirty) {
      // 将 dirty 赋值为 true
      this._dirty = true
      // 通知 component effect
      trigger(toRaw(this), TriggerOpTypes.SET, 'value')
    }
  },
})

// 执行 componentEffect
function componentEffect() {
  if (!instance.isMounted) {
    let vnodeHook: VNodeHook | null | undefined
    const { el, props } = initialVNode
    const { bm, m, parent } = instance

    // 创建组件内模版对应的 vnode，此时会访问到计算属性，触发计算属性取值函数 get
    const subTree = (instance.subTree = renderComponentRoot(instance))

    // 将模版 vnode 渲染成真实的 dom
    patch(null, subTree, container, anchor, instance, parentSuspense, isSVG)
  }
}

// 取值函数 get
class ComputedRefImpl<T> {
  // ..
  get value() {
    // 此时 dirty 为 true
    if (this._dirty) {
      // 求的新值
      this._value = this.effect()
      // dirty 赋值为 false
      this._dirty = false
    }
    // 返回新值
    return this._value
  }
}
```

**计算属性总结**

以模版中的计算属性为例

**依赖收集**

- 首次渲染访问计算属性，dirty 为 true 调用 getter 进行计算，触发计算属性中响应式数据的 proxy.get，将当前 computed effect 作为依赖收集起来
- 计算属性计算完成，dirty 赋值为 false，调用 trigger 将当前组件的 component effect 作为计算属性依赖收集起来
- 完成组件渲染

**派发更新**

- 计算属性中响应式数据发生变化，通知 computed effect
- computed effect 会将 dirty 赋值为 true，然后通知 component effect
- component effect 重新渲染组件，再次访问到计算属性，此时 dirty 为 true，重新计算完成值的更新。
