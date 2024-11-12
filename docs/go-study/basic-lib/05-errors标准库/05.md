# errors标准库

errors包实现了操作错误的函数。go语言使用error类型来返回函数执行过程中遇到的错误，如果返回的error值为nil，则表示未遇到错误，否则error会返回一个字符串，用于说明遇到了什么错误。

~~~go
type error interface {
    Error() string
}
~~~

error不一定表示一个错误，它可以表示任何信息，比如io包中就用error类型的`io.EOF`表示数据读取结束，而不是遇到了什么错误。

## 1. 使用

~~~go
func New(text string) error
~~~

~~~go
package main

import (
	"errors"
	"fmt"
)

func check(s string) (string, error) {
	if s == "" {
		err := errors.New("字符串不能为空")
		return "", err
	} else {
		return s, nil
	}
}

func main() {
	s, err := check("")
	if err != nil {
		fmt.Printf("err: %v\n", err.Error())
	} else {
		fmt.Printf("s: %v\n", s)
	}
}

~~~

## 2. 自定义错误

go允许函数具有多返回值，但通常你不会想写太多的返回值在函数定义上，而标准库内置的error String类型由于只能表达字符串错误信息显然受限。

所以，可以通过实现error接口的方式，来扩展错误返回。

~~~go
package main

import (
	"fmt"
	"time"
)

// 自定义error类型
type MyError struct {
	When time.Time //发生错误的时间
	What string    //错误文本信息
}

func (e MyError) Error() string {
	return fmt.Sprintf("%v: %v", e.When, e.What)
}

func oops() error {
	return MyError{
		time.Date(1989, 3, 15, 22, 30, 0, 0, time.UTC),
		"the file system has gone away",
	}
}

func main() {
	if err := oops(); err != nil {
		fmt.Println(err)
	}
}
~~~

