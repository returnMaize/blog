# json标准库

json包可以实现json的编码和解码，就是将json字符串转换为struct，或者将struct转换为json。

## 1. 核心函数

### 1.1 Marshal

~~~go
func Marshal(v any) ([]byte, error)
~~~

将struct编码成json，可以接收任意类型

* 布尔型转换为 JSON 后仍是布尔型，如true -> true
* 浮点型和整数型转换后为JSON里面的常规数字，如 1.23 -> 1.23
* 字符串将以UTF-8编码转化输出为Unicode字符集的字符串，特殊字符比如<将会被转义为\u003c
* 数组和切片被转换为JSON 里面的数组，[]byte类会被转换为base64编码后的字符串，slice的零值被转换为null
* 结构体会转化为JSON对象，并且只有结构体里边以大写字母开头的可被导出的字段才会被转化输出，而这些可导出的字段会作为JSON对象的字符串索引
* 转化一个map 类型的数据结构时，该数据的类型必须是 map[string]T（T 可以是encoding/json 包支持的任意数据类型）

~~~go
package main

import (
	"encoding/json"
	"fmt"
)

type Person struct {
	Name  string
	Age   int
	Email string
}

func main() {
	p := Person{
		Name:  "zhangsan",
		Age:   20,
		Email: "zhangsan@mail.com",
	}
	b, _ := json.Marshal(p)
	fmt.Printf("b: %v\n", string(b))
}

~~~

### 1.2 Unmarshal

~~~go
func Unmarshal(data []byte, v any) error
~~~

将json转码为struct结构体

这个函数会把传入的 data 作为一个JSON来进行解析，解析后的数据存储在参数 v 中。这个参数 v 也是任意类型的参数（但一定是一个类型的指针），原因是我们在是以此函数进行JSON 解析的时候，这个函数不知道这个传入参数的具体类型，所以它需要接收所有的类型。

~~~go
package main

import (
	"encoding/json"
	"fmt"
)

type Person struct {
	Name  string
	Age   int
	Email string
}

func main() {
	b := []byte(`{"Name":"zhangsan","Age":20,"Email":"zhangsan@mail.com"}`)
	var m Person
	json.Unmarshal(b, &m)
	fmt.Printf("m: %v\n", m)
}

~~~

## 2. 核心结构

### 2.1 Decoder

~~~go
type Decoder struct {
    // contains filtered or unexported fields
}

~~~

从输入流读取并解析json，应用于**io流Reader Writer可以扩展到http websocket等场景**

~~~go
package main

import (
	"encoding/json"
	"fmt"
	"os"
)

func main() {
	f, _ := os.Open("test.json")
	defer f.Close()

	d := json.NewDecoder(f)
	var v map[string]interface{}
	d.Decode(&v)

	fmt.Printf("v: %v\n", v)
}

~~~

### 2.2 Encoder

~~~go
type Encoder struct {
    // contains filtered or unexported fields
}

~~~

写json到输出流，应用于**io流Reader Writer可以扩展到http websocket等场景**

~~~go
package main

import (
	"encoding/json"
	"os"
)

type Person struct {
	Name   string
	Age    int
	Email  string
	Parent []string
}

func main() {
	p := Person{
		Name:   "zhangsan",
		Age:    20,
		Email:  "zhangsan@mail.com",
		Parent: []string{"Daddy", "Mom"},
	}
	f, _ := os.OpenFile("test.json", os.O_WRONLY, 077)
	defer f.Close()

	d := json.NewEncoder(f)
	d.Encode(p)
}

~~~

