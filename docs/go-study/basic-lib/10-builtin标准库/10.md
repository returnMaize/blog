# builtin标准库

builtin包提供了一些类型声明、变量和常量声明，还有一些便利函数，这个包不需要导入，这些变量和函数就可以直接使用

## 1. 常用函数

### 1.1 append

~~~go
func append(slice []Type, elems ...Type) []Type
~~~

* `slice = append(slice, elem1, elem2)`	

​	直接在slice后面添加单个元素，添加元素类型可以和slice相同，也可以不同

* `slice = append(slice, anotherSlice)`	

​	直接将另外一个slice添加到slice后面，但其本质还是将anotherSlice中的元素一个一个添加到slice中，和上一种方式类似


~~~go
package main

import "fmt"

func main() {
	s1 := []int{1, 2, 3}
	i := append(s1, 4)
	fmt.Printf("i: %v\n", i)

	s2 := []int{7, 8, 9}
	i2 := append(s1, s2...)
	fmt.Printf("i2: %v\n", i2)
}

~~~

### 1.2 len

返回，数组、切片、字符串、通道的长度

~~~go
package main

import "fmt"

func main() {
	s1 := "hello world"
	i := len(s1)
	fmt.Printf("i: %v\n", i)

	s2 := []int{1, 2, 3}
	fmt.Printf("len(s2): %v\n", len(s2))
}

~~~

### 1.3 print、println

打印输出到控制台

~~~go
package main

import "fmt"

func main() {
	name := "zhangsan"
	age := 20
	print(name, " ", age, "\n")
	fmt.Println("---------")
	println(name, " ", age)
}
~~~

## 2. 重点常用函数

### 2.1 panic

抛出一个panic异常

~~~go
package main

import "fmt"

func main() {
	defer fmt.Println("panic 异常后执行...")
	panic("panic 错误...")
	fmt.Println("end...")
}

~~~

### 2.2 new和make

new和make区别：

- make只能用来分配及初始化类型为`slice`，`map`，`chan`的数据；new可以分配任意类型的数据；
- new分配返回的是指针，即类型*T；make返回引用，即T；
- new分配的空间被清零，make分配后，会进行初始化。

#### 2.2.1 new

~~~go
package main

import "fmt"

func main() {
	b := new(bool)
	fmt.Println(*b)
	i := new(int)
	fmt.Println(*i)
	s := new(string)
	fmt.Println(*s)
}

~~~

#### 2.2.2 make

例如：make([]int, 10 , 100)

说明：分配一个有100个int的数组，然后创建一个长度为10，容量为100的slice结构，该slice引用包含前10个元素的数组。对应的，new([]int)返回一个指向新分配的，被置零的slice结构体的指针，即指向值为nil的slice的指针。

> 内建函数make(T, args)与new(T)的用途不一样。它只用来创建slice、map和channel，并且返回一个初始化的（而不是置零），类型为T的值（而不是*T）。之所以有所不同，是因为这三个类型的背后引用了使用前必须初始化的数据结构。例如，slice是一个三元描述符，包含一个指向数据（在数组中）的指针，长度，以及容量，在这些项被初始化之前，slice都是nil的。对于slice，map和channel，make初始化这些内部数据结构，并准备好可用的值。

~~~go
package main

import "fmt"

func main() {
	var p *[]int = new([]int)     // allocates slice structure; *p == ni; rarely useful
	var v []int = make([]int, 10) // the slice v now refers to a new array of 100 ints

	fmt.Printf("p: %v\n", p)
	fmt.Printf("v: %v\n", v)

	var p1 *[]int = new([]int)
	*p1 = make([]int, 5, 10)

	// Idiomatic: 习惯的做法
	v1 := make([]int, 10)

	fmt.Printf("p1: %v\n", p1)
	fmt.Printf("v1: %v\n", v1)
}

~~~

