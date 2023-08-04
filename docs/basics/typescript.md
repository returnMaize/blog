## 基础

- tsc 编译器默认会对 ts 代码进行降级编译（默认 --target 是 es3）
- ts 默认会检查函数参数数量（函数调用时，ts 允许 实参 >= 行参）

```ts
function foo(name: string, age: number) {
  console.log(`${name} 已经 ${age} 岁了`)
}

foo('hjx') // ❌
foo('hjx', 24) // ✅
foo('hjx', 24, 'hehe') // ✅
```

- ts 能根据上下文推导出变量类型（可以推导出 this 的类型）
- 类型别名 和 接口的区别（类型别名不能重复声明）

```ts
type Name = 'hjx'
type Name = 'cmx'
// ❌

interface Person {
  name: string
}

interface Person {
  age: number
}

// ✅ 接口名相同会进行类型合并，最后结果为
interface ResultPerson {
  name: string
  age: number
}
```

- 类型断言不允许给明确类型的值断言（否则会报错）

```ts
const name = 'hjx' as number // ❌
```

- ts 的类型推导默认只会推导出具体的类型，而非具体的字面量。如果想要让 ts 推导为具体的字面量的值

```ts
const obj = { name: 'hjx', age: 20 }
// 推导结果为
type obj = { name: string; age: number }

const obj = { name: 'hjx', age: 20 } as const
// 推导结果为
type obj = {
  readonly name: 'hjx'
  readonly age: 20
}
```

- 函数类型

```ts
// 函数表达式方式声明
type Fn = (message: string) => void

// 类型别名方式声明函数（可以声明具有属性的函数类型）
type Fn = {
  desc: string
  (message: string): void
}

// 通过接口声明构造函数（既可以 new，又可以手动调用。类似 Date、String）
interface CallOrConstruct {
  new (s: string): Date
  (n?: number): string
}

// 函数返回类型为 void，表示函数没有返回值。但也可以返回任何类型的值
type Fn = () => void
const fn: Fn = () => {
  return 'hehe'
} // 并不会报错，因为这也符合 Fn 类型（这里的 void 表示我不会检查你的返回值）

// 但如果显示的告诉 ts 函数存在某个类型的返回值时，那么必须返回对应类型的返回值
function foo(): void {
  return 'hehe' // 报错 Type 'string' is not assignable to type 'void'
}
```

- 对象类型 interface

```ts
// 🌟 readonly 表示将某个属性设置为只读，但仅作用于当前属性，其内部子属性不受影响
interface Person {
  name: string
  readonly girlFriend: {
    name: string
  }
} // girlFriend 不能修改，girlFriend.name 可以修改

// 🌟 index signatures 索引签名，这里的 index 代表的就是索引签名
interface StringArray {
  [index: number]: string
}
interface Person {
  name?: string
  [key: string]: string
}
const person1: Person = { name: 'xxx', xxx: 1234 } // ✅
const person2: Person = { xxx: 'xxx' } // ❌ 和 Person 不存在公共属性

// 🌟 extends 继承
interface Person extends NameLike {
  age: number
}
// extends multiple type 继承多个类型
interface Person extends NameLike, AgeLike {
  friend: string
}

// 🌟 配合泛型变量
interface Box<T> {
  content: T
}
```

## 类型操作

```ts
// 🌟 Generic Constraints 泛型约束
function logLen<T extends { length: number }>(arg: T): T {
  console.log(T.length)
  return T
}

// 🌟 keyof
// 将 interface 所有的索引类型组成一个联合类型返回
interface Person {
  name: string
  [key: string]: any
}
type Key = keyof Person // === type Key = 'name' | string | number
// 这里之所以存在 number 类型，是因为 Person 类型的属性也可以通过数字下标访问

// 🌟 typeof
// 返回 ts 推到出来的类型，但这里需要注意的是。typeof 作用在基础类型的值身上时
// 他的推到会因为声明语法（let，const）的变化推到发生变化
const name1 = 'hjx'
let name2 = 'cmx'
type Name1 = typeof name1 // Name1 = 'hjx' 对于 const 基础类型，推到出来的就是常量值
type Name2 = typeof name2 // Name2 = string
// ⚠️ typeof 后面紧跟具体的变量，不支持运算 typeof fn() ❌

// 🌟 ReturnType<Fn>
// 返回 Fn 函数类型返回的类型。
// ⚠️ 这里的 Fn 是函数类型，并非函数

// 🌟 索引类型
interface Person {
  name: string
  age: number
}
type NameKey = 'name'
type MyString1 = Person[NameKey]
type MyString2 = Person['name']
// 注意：使用索引类型时，索引必须是具体的一个类型，这里的 'name' 代表的是字面量类型 'name',
// 而并非字符串 'name'，如果使用字符串 'name', ts 将会给你抛出一个错误
const key = 'name'
type MyString3 = Person[key] // error
// 'key' refers to a value, but is being used as a type here. Did you mean 'typeof key'?

// 🌟 条件类型
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel

// 🌟 inter（条件泛型）
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type

// 🌟 字符串操作类型
Uppercase<StringType> // 大写
Lowercase<StringType> // 小写
Capitalize<StringType> // 首字母大写
Uncapitalize<StringType> // 首字母小写
```

## 类型方法

```ts
// Pick Omit
type Person = {
  name: string
  age: number
  say(message: string): string
  play(think: string): string
}

type NoAgePerson = Omit<Person, 'age'> // ===
type NoAgePerson = {
  name: string
  say(message: string): string
  play(think: string): string
}

type OnlyNamePerson = Pick<Person, 'name'> // ===
type OnlyNamePerson = { name: string }
```

更多类型方法 [ts docs](https://www.typescriptlang.org/docs/handbook/utility-types.html#awaitedtype)

## 模块

**导入模块中的类型**

```ts
// 仅仅导出类型
import type { createCatName } from './animal.js'
// Inline type imports
import { createCatName, type Cat, type Dog } from './animal.js'
```

**为第三方模块声明类型**

```ts
// node.d.ts
declare module 'path' {
  export function normalize(p: string): string
  export function join(...paths: any[]): string
}
// 快速声明模块（此方式会导致模块中导出的所有类型变为 any 类型）
declare module 'path' // 所有在 path 模块中导出的类型都为 any
```
