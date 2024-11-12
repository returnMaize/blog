# log标准库

golang内置了log包，实现简单的日志服务。通过调用log包的函数，可以实现简单的日志打印功能。

log包定义了Logger类型，该类型提供了一些格式化输出的方法。

log包也提供了一个预定义的“标准”logger，可以通过调用函数Print系列(Print|Printf|Println）、Fatal系列（Fatal|Fatalf|Fatalln）、和Panic系列（Panic|Panicf|Panicln）来使用。



## 1. 说明

log包中有3个系列的日志打印函数，分别`print系列`、`panic系列`、`fatal系列`.

| 函数系列 | 说明                 | 作用                                                  |
| -------- | -------------------- | ----------------------------------------------------- |
| Print    | Print/Printf/Println | 单纯打印日志                                          |
| Panic    | Panic/Panicf/Panicln | 打印日志，抛出panic异常                               |
| Fatal    | Fatal/Fatalf/Fatalln | 打印日志，强制结束程序(os.Exit(1))，defer函数不会执行 |


log包主要提供了3类接口，分别是print系列、panic系列、fatal系列，对每一类接口其提供了3种调用方式。

## 2. Print

单纯打印日志

~~~go
package main

import "log"

func main() {
	log.Print("this is a log")
    log.Printf("this is a log: %d", 100) // 格式化输出
	name := "zhangsan"
	age := 20
	log.Println(name, " ", age)
}

~~~

## 3. Panic

打印出日志并且抛出panic异常，在panic之后声明的代码将不会执行。

~~~go
package main

import (
	"fmt"
	"log"
)

func main() {
	defer fmt.Println("发生了 panic错误！")
	log.Print("this is a log")
	log.Panic("this is a panic log ")
	fmt.Println("运行结束。。。")
}

~~~



## 4. Fatal

将日志内容打印输出，接着调用系统的`os.Exit(1)`接口，强制退出程序并返回状态1，但是有一点需要注意的是，由于直接调用系统os接口退出，defer函数不会调用。

~~~go
package main

import (
	"fmt"
	"log"
)

func main() {
	defer fmt.Println("defer。。。")
	log.Print("this is a log")
	log.Fatal("this is a fatal log")
	fmt.Println("运行结束。。。")
}

~~~

## 5. 日志配置

默认情况下log只会打印出时间，但是实际情况下我们还需要获取文件名，行号等信息，log包提供给我们定制的接口。

| 方法                    | 说明                |
| ----------------------- | ------------------- |
| func Flags() int        | 返回标准log输出配置 |
| func SetFlags(flag int) | 设置标准log输出配置 |

~~~go
const (
    // 控制输出日志信息的细节，不能控制输出的顺序和格式。
    // 输出的日志在每一项后会有一个冒号分隔，例如2022/07/23 01:23:23.123123 /a/b/c/d.go:23: message
    Ldate         = 1 << iota     // 日期，2022/07/23
    Ltime                         // 时间，01:23:23
    Lmicroseconds                 // 微秒级别的时间，01:23:23.123123（用于增强Ltime位）
    Llongfile                     // 文件全路径名+行号，/a/b/c/d.go:23
    Lshortfile                    // 文件名+行号，d.go:23（会覆盖掉Llongfile）
    LUTC                          // 使用UTC时间
    LstdFlags     = Ldate | Ltime // 标准logger的初始值
)

~~~

~~~go
package main

import (
	"fmt"
	"log"
)

func main() {
	i := log.Flags()
	fmt.Printf("i: %v\n", i)
	log.SetFlags(log.Ldate | log.Ltime | log.Llongfile)
	log.Print("this is a log")
}

~~~

### 5.1 前缀配置

| 方法                          | 说明               |
| ----------------------------- | ------------------ |
| func Prefix() string          | 返回日志的前缀配置 |
| func SetPrefix(prefix string) | 设置日志前缀       |

~~~go
package main

import (
	"fmt"
	"log"
)

func main() {
	s := log.Prefix()
	fmt.Printf("s: %v\n", s)
	log.SetPrefix("[MyLog] ")
	s = log.Prefix()
	fmt.Printf("s: %v\n", s)
	log.Print("this is a log...")
}

~~~

### 5.2 输出到文件

log包提供了`func SetOutput(w io.Writer)`函数，将日志输出到文件中。

~~~go
package main

import (
	"log"
	"os"
)

func main() {
	f, err := os.OpenFile("test.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	if err != nil {
		log.Panic("打开日志文件异常")
	}
	log.SetOutput(f)
	log.Print("this is a file log...")
}

~~~

## 6. 自定义Logger

log包中提供了`func New(out io.Writer, prefix string, flag int) *Logger`函数来实现自定义logger。

~~~go
package main

import (
	"log"
	"os"
)

var logger *log.Logger

func init() {
	logFile, err := os.OpenFile("test.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	if err != nil {
		log.Panic("打开日志文件异常")
	}
	logger = log.New(logFile, "[Mylog]", log.Ldate|log.Ltime|log.Lshortfile)
}

func main() {
	logger.Println("自定义logger")
}

~~~

