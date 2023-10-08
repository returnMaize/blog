## 变量声明

**语法：`var 字面量 变量类型 = 变量值`**

**示例**

```go
func main () {
    // 只声明
    var name string // string 默认值为空字符
    var age int // int 默认值为 0
    var isBad bool // bool 默认值为 false
    // ...


    // 声明加赋值
    var name string = "hjx"

    // 类型推导（这点和 ts 类似）
    var name = "hjx"

    // 连续声明
    var (
		name  string
		age   int
		isBad bool
	)

    // 连续申明赋值
    var name, age, isBad = "hjx", 20, true

    // 短变量声明（类似 JS 的局部变量，只能存在于函数内部）
    name := "hjx"
}
```

## 常量声明

**语法：`const 字面量 常量类型 = 常量值`**

**示例**

```go
func main () {
    const PI = 3.14
    // 其他用法和 var 相同，常量值不可修改，声明时必须赋值

    // 特殊的常量 iota（编辑器内部修改的常量值，每赋值一次，常量值都会 +1，初始值为 0）
    const (
        a = iota
        b = iota
        c = iota
    )

    // 也可以使用 _ 打断
    const (
        a = iota
        _
        b = iota
    )
    // print a = 0; b = 2
}
```
