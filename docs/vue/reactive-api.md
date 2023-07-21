## ref

我们知道 `reactive` 能够将一个对象类型的数据转化成响应式数据，但对于 js 中的原始类型数据无能为力，这时就需要使用到 `vue` 提供的 `ref` API。

**介绍**

`ref` 能够将一个原始类型数据转变成响应式数据

**源码**

```ts
export function ref(value?: unknown) {
  return createRef(value)
}

function createRef(rawValue: unknown) {
  // ...
  return new RefImpl(rawValue)
}

class RefImpl<T> {
  private _value: T

  public readonly __v_isRef = true

  constructor(private _rawValue: T) {
    // convert 方法会判断 ref 传入的值，如果值是对对象类型会调用 reactive 将其转化成响应式对象返回
    // 如果是原始类型直接返回
    this._value = convert(_rawValue)
  }

  // value 的取值函数，在访问 ref.value 时执行
  get value() {
    // 调用 track 依赖收集
    track(toRaw(this), TrackOpTypes.GET, 'value')
    return this._value
  }

  // value 的存值函数，在设置 ref.value 属性值时执行
  set value(newVal) {
    if (hasChanged(toRaw(newVal), this._rawValue)) {
      this._rawValue = newVal
      // 如果新值是对象，调用 reactive 转化成响应式对象
      this._value = this._shallow ? newVal : convert(newVal)
      // 调用 trigger 派发更新
      trigger(toRaw(this), TriggerOpTypes.SET, 'value', newVal)
    }
  }
}
```

**ref 总结**

可以看到 `ref` 的实现非常的简单，当我们使用 `ref` 将一个原始类型数据转化成响应式数据时，`ref` 会实例化一个 ref 类型的对象，它通过类的取值函数和存值函数对原始数据的访问和设置进行拦截。并规定我们只能通过 ref.value 的方式访问和设置该原始数据，访问时会触发取值函数 get，get 函数会通过 `track` 函数完成依赖收集，修改数据时会触发存值函数 set，set 函数会通过 `trigger` 函数完成派发更新。

## toRefs

**介绍**

当我们对一个 reactive 类型的响应式数据进行解构时，会使得解构出来的数据失去响应式。因为解构是值的拷贝，新值的访问并不会触发代理的 get 处理函数。这时我们就可以使用到 `toRefs` 函数，它能维持解构数据的响应式。

**源码**

```ts
export function toRefs<T extends object>(object: T): ToRefs<T> {
  for (const key in object) {
    // 遍历代理对象上属性，调用 toRef 函数
    ret[key] = toRef(object, key)
  }
  return ret
}

export function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K
): ToRef<T[K]> {
  // 如果是 ref 类型，直接返回，否则实例化 ObjectRefImpl
  return isRef(object[key])
    ? object[key]
    : (new ObjectRefImpl(object, key) as any)
}

class ObjectRefImpl<T extends object, K extends keyof T> {
  public readonly __v_isRef = true

  constructor(private readonly _object: T, private readonly _key: K) {}
  // 取值函数，内部给我们通过代理对象访问值，触发代理对象上 get 处理器完成依赖收集
  get value() {
    return this._object[this._key]
  }

  // 存值函数，内部通过代理对象设置值，触发代理对象上的 set 处理器完成派发更新
  set value(newVal) {
    this._object[this._key] = newVal
  }
}
```

**toRefs 总结**

将 `toRefs` 传入对象的属性的值变成一个带 value 属性的对象，通过取值函数很存值函数对值的访问和赋值进行劫持，取值时内部手动通过代理对象进行访问触发依赖收集，存值时内部通过代理对象进行修改触发派发更新。
