# math标准库

math包包含一些常量和一些有用的数学计算函数,例如:三角函数、随机数、绝对值、平方等

## 1. 常量

```go
fmt.Printf("Float64的最大值: %.f\n", math.MaxFloat64)
fmt.Printf("Float64最小值: %.f\n", math.SmallestNonzeroFloat64)
fmt.Printf("Float32最大值: %.f\n", math.MaxFloat32)
fmt.Printf("Float32最小值: %.f\n", math.SmallestNonzeroFloat32)
fmt.Printf("Int8最大值: %d\n", math.MaxInt8)
fmt.Printf("Int8最小值: %d\n", math.MinInt8)
fmt.Printf("Uint8最大值: %d\n", math.MaxUint8)
fmt.Printf("Int16最大值: %d\n", math.MaxInt16)
fmt.Printf("Int16最小值: %d\n", math.MinInt16)
fmt.Printf("Uint16最大值: %d\n", math.MaxUint16)
fmt.Printf("Int32最大值: %d\n", math.MaxInt32)
fmt.Printf("Int32最小值: %d\n", math.MinInt32)
fmt.Printf("Uint32最大值: %d\n", math.MaxUint32)
fmt.Printf("Int64最大值: %d\n", math.MaxInt64)
fmt.Printf("Int64最小值: %d\n", math.MinInt64)
fmt.Printf("圆周率默认值: %v\n", math.Pi)
```

常量如下：

```
Float64的最大值: 179769313486231570814527423731704356798070567525844996598917476803157260780028538760589558632766878171540458953514382464234321326889464182768467546703537516986049910576551282076245490090389328944075868508455133942304583236903222948165808559332123348274797826204144723168738177180919299881250404026184124858368
Float64最小值: 0
Float32最大值: 340282346638528859811704183484516925440
Float32最小值: 0
Int8最大值: 127
Int8最小值: -128
Uint8最大值: 255
Int16最大值: 32767
Int16最小值: -32768
Uint16最大值: 65535
Int32最大值: 2147483647
Int32最小值: -2147483648
Uint32最大值: 4294967295
Int64最大值: 9223372036854775807
Int64最小值: -9223372036854775808
圆周率默认值: 3.141592653589793
```

## 2. 常用函数

### 2.1 IsNaN函数

```go
func IsNaN(f float64) (is bool)
```

报告f是否表示一个NaN（Not A Number）值，是数值返回一个false，不是数值则返回一个true。

```go
func testIsNaN() {
	fmt.Println(math.IsNaN(12321.321321))    //false
}
```

### 2.2 Ceil函数

```go
func Ceil(x float64) float64
```

返回一个不小于x的最小整数，简单来说就是向上取整

```go
func testCeil() {
	fmt.Println(math.Ceil(1.13456))    //2
}
```

### 2.3 Floor函数

```go
func Floor(x float64) float64
```

返回一个不大于x的最小整数，简单来说就是向下取整

```go
func testFloor() {
	fmt.Println(math.Floor(2.9999))    //2
}
```

### 2.4 Trunc函数

```go
func Trunc(x float64) float64
```

返回x整数部分，与Floor一样

```go
func testTrunc() {
	fmt.Println(math.Trunc(2.9999))    //2
}
```

### 2.5 Abs函数

```go
func Abs(x float64) float64
```

返回x的绝对值

```go
func testAbs() {
	fmt.Println(math.Abs(2.999312323132141665374))    //2.9993123231321417
	fmt.Println(math.Abs(2.999312323132141465374))    //2.9993123231321412
}
```

### 2.6 Max函数

```go
func Max(x, y float64) float64
```

返回x和y中最大值

```go
func testMax() {
	fmt.Println(math.Max(1000,200))    //1000
}
```

### 2.7 Min函数

```go
func Min(x, y float64) float64
```

返回x和y中最小值

```go
func testMin() {
	fmt.Println(math.Min(1000,200))    //200
}
```

### 2.8 Dim函数

```go
func Dim(x, y float64) float64
```

函数返回x-y和0中的最大值

```go
func testDim() {
	fmt.Println(math.Dim(1000,2000))    //0
	fmt.Println(math.Dim(1000,200))    //800
}
```

### 2.9 Mod函数

```go
func Mod(x, y float64) float64
```

取余运算，可以理解为 x-Trunc(x/y)*y，结果的正负号和x相同

```go
func testMod() {
	fmt.Println(math.Mod(123,0))    //NaN
	fmt.Println(math.Mod(123,10))    //3
}
```

### 2.10 Sqrt函数

```go
func Sqrt(x float64) float64
```

返回x的二次方根,平方根

```go
func testSqrt() {
	fmt.Println(math.Sqrt(144))    //12
}
```

### 2.11 Cbrt函数

```go
func Cbrt(x float64) float64
```

返回x的三次方根,立方根

```go
func testCbrt() {
	fmt.Println(math.Cbrt(1728))    //12
}
```

### 2.12 Hypot函数

```go
func Hypot(p, q float64) float64
```

返回Sqrt(p * p + q * q)，注意要避免不必要的溢出或下溢。

```go
func testHypot() {
	fmt.Println(math.Hypot(12,12))    //16.970562748477143
}
```

### 2.13 Pow函数

```go
func Pow(x, y float64) float64
```

求幂，x的y次方

```go
func testPow() {
	fmt.Println(math.Pow(2,3))    //8
}
```

### 2.14 Sin函数

```go
func Sin(x float64) float64
```

求正弦

```go
func testSin() {
	fmt.Println(math.Sin(12))    //-0.5365729180004349
}
```

### 2.15 Cos函数

```go
func Cos(x float64) float64
```

求余弦

```go
func testCos() {
	fmt.Println(math.Cos(12))    //0.8438539587324921
}
```

### 2.16 Tan函数

```go
func Tan(x float64) float64
```

求正切

```go
func testTan() {
	fmt.Println(math.Tan(12))    //-0.6358599286615807
}
```

### 2.17 Log函数

```go
func Log(x float64) float64
```

求自然对数

```go
func testLog() {
	fmt.Println(math.Log(2))    //0.6931471805599453
}
```

### 2.18 Log2函数

```go
func Log2(x float64) float64
```

求2为底的对数

```go
func testLog2() {
	fmt.Println(math.Log2(128))    //7
}
```

### 2.19 Log10函数

```go
func Log10(x float64) float64
```

求10为底的对数

```go
func testLog10() {
	fmt.Println(math.Log10(10000))    //4
}
```

### 2.20 Signbit函数

```go
func Signbit(x float64) bool
```

如果x是一个负数或者负零，返回true

```go
func testSignbit() {
	fmt.Println(math.Signbit(10000))    //false
	fmt.Println(math.Signbit(-200))    //true
}
```

## 3. 随机数math/rand

math/rand包是go提供用来产生各种各样随机数的包，注意：rand生成的数值虽然说是随机数，但它其实是**伪随机数**。

rand实现的几个方法：

| 函数                                     | 说明                                                         |
| ---------------------------------------- | ------------------------------------------------------------ |
| `func (r *Rand) Int() int`               | 返回一个非负的伪随机int值。                                  |
| `func (r *Rand) Int31() int32`           | 返回一个int32类型的非负的31位伪随机数。                      |
| `func (r *Rand) Intn(n int) int`         | 返回一个取值范围在[0,n)的伪随机int值，如果n<=0会panic。      |
| `func Int63() int64`                     | 返回一个int64类型的非负的63位伪随机数。                      |
| `func Uint32() uint32`                   | 返回一个uint32类型的非负的32位伪随机数。                     |
| `func Uint64() uint64`                   | 返回一个uint64类型的非负的32位伪随机数。                     |
| `func Int31n(n int32) int32`             | 返回一个取值范围在[0,n)的伪随机int32值，如果n<=0会panic。    |
| `func Int63n(n int64) int64`             | 返回一个取值范围在[0, n)的伪随机int64值，如果n<=0会panic。   |
| `func Float32() float32`                 | 返回一个取值范围在[0.0, 1.0)的伪随机float32值。              |
| `func Float64() float64`                 | 返回一个取值范围在[0.0, 1.0)的伪随机float64值。              |
| `func Perm(n int) []int`                 | 返回一个有n个元素的，[0,n)范围内整数的伪随机的切片。         |
| `func Read(p []byte) (n int, err error)` | 生成len§个伪随机数，伪随机数的范围为0-255；并将伪随机数存入p，返回len§和可能发生的错误。 |
| `func NewSource(seed int64) Source`      | 使用给定的种子创建一个伪随机资源。                           |
| `func New(src Source) *Rand`             | 返回一个使用src随机源生成一个Rand。                          |

简单使用：

```go
package main
 
import (
  "fmt"
  "math/rand"
)

func main() {
  // 直接调用rand的方法生成伪随机int值
  fmt.Println(rand.Int()) // 5577006791947779410
  fmt.Println(rand.Int31()) // 2019727887
  fmt.Println(rand.Intn(5)) // 2
}
```

但是当把代码运行多次发现，结果都是一样的。不管怎么运行代码，产生的结果都是这三个数，结果不会变。**这是因为我们还没有设置随机数种子的原因。**

```go
func (r *Rand) Seed(seed int64) 
```

使用给定的seed来初始化生成器到一个确定的状态，这就是设置随机种子。

修改之后的代码：

```go
package main
 
import (
  "fmt"
  "math/rand"
)

func main() {
  // 直接调用rand的方法生成伪随机int值
  rand.Seed(time.Now().Unix()) // 设置种子，我们以当前时间的秒；当然也可以用毫秒，微秒等
  fmt.Println(rand.Int())
  fmt.Println(rand.Int31())
  fmt.Println(rand.Intn(5))
}
```

上面的代码，多次运行，就会发现，结果是不一样的了。

实例演示：

```go
package main

import (
	"fmt"
	"math/rand"
	"time"
)

func init() {
	// 以时间作为初始化种子
	rand.Seed(time.Now().UnixNano())
}

func myRand() {
	for i := 0; i < 10; i++ {
		a := rand.Int()
		fmt.Printf("a: %v\n", a)
	}
	fmt.Println("----------")

	for i := 0; i < 10; i++ {
		a := rand.Intn(100)
		fmt.Printf("a: %v\n", a)
	}
	fmt.Println("----------")

	for i := 0; i < 10; i++ {
		a := rand.Float32()
		fmt.Printf("a: %v\n", a)
	}
	fmt.Println("----------")

	source := rand.NewSource(time.Now().UnixNano()) // 使用当前的纳秒生成一个随机源，也就是随机种子。NewSource()方法就等价于前面的rand.Seed()方法,都是用来设置随机种子。，这两种方法本质上没有区别。
	ran := rand.New(source) // 生成一个rand
	fmt.Println(ran.Int()) // 获取随机数
}

func main() {
	myRand()
}
```