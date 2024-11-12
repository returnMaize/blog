# sort标准库

sort包提供了排序切片和用户自定义数据集以及相关功能的函数。

sort包主要针对`[]int`、`[]float64`、`[]string`、以及其他自定义切片的排序。

主要包括：

- 对基本数据类型切片的排序支持。
- 基本数据元素查找。
- 判断基本数据类型切片是否已经排好序。
- 对排好序的数据集合逆序

## 1. 排序接口

```go
type Interface interface {
    Len() int	// 获取数据集合元素个数
    
    Less(i, j int) bool	// 如果i索引的数据小于j索引的数据，返回true，Swap()，即数据升序排序，false 不调用swap。
    
    Swap(i, j int)	// 交换i和j索引的两个元素的位置
}
```

实例演示：

```go
package main

import (
	"fmt"
	"sort"
)

type NewInts []uint

func (n NewInts) Len() int {
	return len(n)
}

func (n NewInts) Less(i, j int) bool {
	fmt.Println(i, j, n[i] < n[j], n)
	return n[i] < n[j]
}

func (n NewInts) Swap(i, j int) {
	n[i], n[j] = n[j], n[i]
}

func main() {
	n := []uint{1, 3, 2}
	sort.Sort(NewInts(n))
	fmt.Println(n)
}

```



## 2. 相关函数汇总

```go
func Ints(a []int)
func IntsAreSorted(a []int) bool
func SearchInts(a []int, x int) int
func Float64s(a []float64)
func Float64sAreSorted(a []float64) bool
func SearchFloat64s(a []float64, x float64) int
func SearchFloat64s(a []float64, x float64) bool
func Strings(a []string)
func StringsAreSorted(a []string) bool
func SearchStrings(a []string, x string) int
func Sort(data Interface)
func Stable(data Interface)
func Reverse(data Interface) Interface
func IsSorted(data Interface) bool
func Search(n int, f func(int) bool) int
```

## 3. 数据集合排序

### 3.1 Sort排序方法

对数据集合（包括自定义数据类型的集合）排序，需要实现`sort.Interface`接口的三个方法，即：

```go
type Interface interface {
    Len() int	// 获取数据集合元素个数
    
    Less(i, j int) bool	// 如果i索引的数据小于j索引的数据，返回true，Swap()，即数据升序排序。
    
    Swap(i, j int)	// 交换i和j索引的两个元素的位置
}
```

实现了这三个方法后，即可调用该包的Sort()方法进行排序。 Sort()方法定义如下：

```go
func Sort(data Interface)
```

Sort()方法唯一的参数就是待排序的数据集合。

### 3.2 IsSorted是否已排序方法

sort包提供了IsSorted方法，可以判断数据集合是否已经排好顺序。IsSorted方法的内部实现依赖于我们自己实现的Len()和Less()方法：

```go
func IsSorted(data Interface) bool {
    n := data.Len()
    for i := n - 1; i > 0; i-- {
        if data.Less(i, i-1) {
            return false
        }
    }
    return true
}
```

### 3.3 Reverse逆序排序方法

sort包提供了Reverse()方法，将数据按Less()定义的排序方式逆序排序，而不必修改Less()代码。方法定义如下：

```go
func Reverse(data Interface) Interface
```

看下Reverse()的内部实现，可以看到Reverse()返回一个sort.Interface接口类型的值：

```go
//定义了一个reverse结构类型，嵌入Interface接口。
type reverse struct {
    Interface
}
 
//reverse结构类型的Less()方法拥有嵌入的Less()方法相反的行为。
//Len()和Swap()方法则会保持嵌入类型的方法行为。
func (r reverse) Less(i, j int) bool {
    return r.Interface.Less(j, i)
}
 
//返回新的实现Interface接口的数据类型。
func Reverse(data Interface) Interface {
    return &reverse{data}
}
```

### 3.4 Search查询位置方法

sort包提供Search方法查询位置，其实现如下：

```go
func Search(n int, f func(int) bool) int
```

Search()方法会使用“**二分查找**”算法，来搜索某指定切片[0:n]，并返回能够使f(i)=true的最小i（0<=i<n）值，并且会假定：如果f(i)=true，则f(i+1)=true。即对于切片[0:n]，i之前的切片元素会使f()函数返回false，i及i之后的元素会使f()函数返回true。但是，当在切片中无法找到时f(i)=true的i时（此时切片元素都不能使f()函数返回true），Search() 方法会返回n。

## 4.  sort包支持的内部数据类型

### 4.1 `[]int`排序

sort包定义了一个IntSlice类型，并且实现了sort.Interface接口：

```go
type IntSlice []int
func (p IntSlice) Len() int           { return len(p) }
func (p IntSlice) Less(i, j int) bool { return p[i] < p[j] }
func (p IntSlice) Swap(i, j int)      { p[i], p[j] = p[j], p[i] }
//IntSlice类型定义了Sort()方法，包装了sort.Sort()函数
func (p IntSlice) Sort() { Sort(p) }
//IntSlice类型定义了Search()方法，包装了SearchInts()函数
func (p IntSlice) Search(x int) int { return SearchInts(p, x) }
```

并且，提供的sort.Ints()方法使用了该IntSlice类型：

```go
func Ints(a []int) { Sort(IntSlice(a)) }
```

> 所以，对[]int切片升序排序，经常使用`sort.Ints()`，而不是直接使用IntSlice类型。

实例演示：

```go
package main

import (
	"fmt"
	"sort"
)

func main() {
	f := []int{3, 5, 1, 2, 4}
	fmt.Printf("排序前f: %v\n", f)
	sort.Ints(f)
	fmt.Printf("排序后f: %v\n", f)
}
```



如果要使用降序排序，显然要用前面提到的Reverse()方法：

```go
package main

import (
	"fmt"
	"sort"
)

func main() {
	f := []int{3, 5, 1, 2, 4}
	fmt.Printf("排序前f: %v\n", f)
	sort.Ints(f)
	fmt.Printf("排序后f: %v\n", f)
	sort.Sort(sort.Reverse(sort.IntSlice(f)))
	fmt.Printf("降序排序后f: %v\n", f)
}
```



如果要查找整数x在切片a中的位置，相对于前面提到的Search()方法，sort包提供了SearchInts():`func SearchInts(a []int, x int) int`

```go
package main

import (
	"fmt"
	"sort"
)

func main() {
	f := []int{3, 5, 1, 2, 4}
	fmt.Printf("排序前f: %v\n", f)
	sort.Ints(f)
	fmt.Printf("排序后f: %v\n", f)
	r := sort.SearchInts(f, 3)
	fmt.Printf("3的索引位置为: %v\n", r)
}
```



> 注意，SearchInts()的使用条件为：**切片a已经升序排序**。

### 4.2 `[]float64`排序

实现与Ints类似

内部实现：

```go
type Float64Slice []float64
func (p Float64Slice) Len() int           { return len(p) }
func (p Float64Slice) Less(i, j int) bool { return p[i] < p[j] || isNaN(p[i]) && !isNaN(p[j]) }
func (p Float64Slice) Swap(i, j int)      { p[i], p[j] = p[j], p[i] }
func (p Float64Slice) Sort() { Sort(p) }
func (p Float64Slice) Search(x float64) int { return SearchFloat64s(p, x) }
```

与Sort()、IsSorted()、Search()相对应的三个方法：

```go
func Float64s(a []float64)  
func Float64sAreSorted(a []float64) bool
func SearchFloat64s(a []float64, x float64) int
```

实例演示：

```go
package main

import (
	"fmt"
	"sort"
)

func main() {
	f := []float64{1.1, 4.4, 5.5, 3.3, 2.2}
	fmt.Printf("排序前的f: %v\n", f)
	sort.Float64s(f)
	fmt.Printf("排序后的f: %v\n", f)
}
```



其他如Search()方法与Ints类似，不再赘述。

> 需要注意：在上面Float64Slice类型定义的Less方法中，有一个内部函数isNaN()。 isNaN()与math包中IsNaN()实现完全相同，sort包之所以不使用math.IsNaN()，完全是基于包依赖性的考虑。应当看到，sort包的实现不依赖于其他任何包。

### 4.3 `[]string`排序

> 两个string对象之间的大小比较是基于“字典序”的。

实现与Ints类似

内部实现：

```go
type StringSlice []string
func (p StringSlice) Len() int           { return len(p) }
func (p StringSlice) Less(i, j int) bool { return p[i] < p[j] }
func (p StringSlice) Swap(i, j int)      { p[i], p[j] = p[j], p[i] }
func (p StringSlice) Sort() { Sort(p) }
func (p StringSlice) Search(x string) int { return SearchStrings(p, x) }
```

与Sort()、IsSorted()、Search()相对应的三个方法：

```go
func Strings(a []string)
func StringsAreSorted(a []string) bool
func SearchStrings(a []string, x string) int
```

实例演示：

```go
package main

import (
	"fmt"
	"sort"
)

func test1() {
	ls := sort.StringSlice{
		"100",
		"42",
		"41",
		"3",
		"2",
	}
	fmt.Println(ls)
	sort.Strings(ls)
	fmt.Println(ls)
}

func test2() {
	ls := sort.StringSlice{
		"d",
		"ac",
		"c",
		"ab",
		"e",
	}
	fmt.Println(ls)
	sort.Strings(ls)
	fmt.Println(ls)
}

func test3() {
	ls := sort.StringSlice{
		"啊",
		"博",
		"次",
		"得",
		"饿",
		"周",
	}
	fmt.Println(ls)
	sort.Strings(ls)
	fmt.Println(ls)

	for _, v := range ls {
		fmt.Println(v, []byte(v))
	}
}

func main() {
	test1()
	fmt.Println("----------")
	test2()
	fmt.Println("----------")
	test3()
}
```



### 4.4 复杂结构: `[][]int`排序

实例演示：

```go
package main

import (
	"fmt"
	"sort"
)

type testSlice [][]int

func (l testSlice) Len() int           { return len(l) }
func (l testSlice) Swap(i, j int)      { l[i], l[j] = l[j], l[i] }
func (l testSlice) Less(i, j int) bool { return l[i][1] < l[j][1] }

func main() {
	ls := testSlice{
		{1, 4},
		{9, 3},
		{7, 5},
	}

	fmt.Println(ls)
	sort.Sort(ls)
	fmt.Println(ls)
}
```



### 4.5 复杂结构体排序

实例演示：

```go
package main
 
import (
    "fmt"
    "sort"
)
 
type testSlice []map[string]float64
 
func (l testSlice) Len() int           { return len(l) }
func (l testSlice) Swap(i, j int)      { l[i], l[j] = l[j], l[i] }
func (l testSlice) Less(i, j int) bool { return l[i]["a"] < l[j]["a"] } // 按照"a"对应的值排序
 
func main() {
    ls := testSlice{
        {"a": 4, "b": 12},
        {"a": 3, "b": 11},
        {"a": 5, "b": 10},
    }
 
    fmt.Println(ls)
    sort.Sort(ls)
    fmt.Println(ls)
}
```



### 4.6 复杂结构体：`[]struct`排序

实例演示：

```go
package main

import (
	"fmt"
	"sort"
)

type People struct {
	Name string
	Age  int
}

type testSlice []People

func (l testSlice) Len() int           { return len(l) }
func (l testSlice) Swap(i, j int)      { l[i], l[j] = l[j], l[i] }
func (l testSlice) Less(i, j int) bool { return l[i].Age < l[j].Age }

func main() {
	ls := testSlice{
		{Name: "n1", Age: 12},
		{Name: "n2", Age: 11},
		{Name: "n3", Age: 10},
	}

	fmt.Println(ls)
	sort.Sort(ls)
	fmt.Println(ls)
}
```