# context标准库

context 翻译成中文是 **上下文** 的意思，它可以对 API 和进程之间传递截止日期、取消信号和其他请求范围的值。

使用上下文的程序应遵循以下规则：

1. 保持包之间的接口一致
2. 不要在结构类型中存储上下文
3. 上下文应该是第一个参数，通常命名为ctx
4. 上下文值仅用于传输进程和API的请求范围数据，而不用于向函数传递可选参数

context 是 Golang 开发常用的并发编程技术。

`Context 实际上只定义了接口，凡是实现该接口的类都可称为是一种 context，官方包实现了几个常用的context，分别可用于不同的场景。`

## 1. context类型

### 1.1 空 context

context包中定义了一个空的context，名为emptyCtx，用于 context 的根节点，空的 context 只是简单的实现了 context，本身不包含任何值，仅用于其他 context 的父节点。

~~~go
type emptyCtx int

func (*emptyCtx) Deadline() (deadline time.Time, ok bool) {
	return
}

func (*emptyCtx) Done() <-chan struct{} {
	return nil
}

func (*emptyCtx) Err() error {
	return nil
}

func (*emptyCtx) Value(key any) any {
	return nil
}

func (e *emptyCtx) String() string {
	switch e {
	case background:
		return "context.Background"
	case todo:
		return "context.TODO"
	}
	return "unknown empty Context"
}
~~~

### 1.2 CancelFunc 类型原型

~~~go
// CancelFunc类型是一个停止工作的方法
// CancelFunc不会等待工作停止
// CancelFunc可以被多个goroutine同时调用, 在第一次调用之后, 对CancelFunc的后续调用什么也不做
type CancelFunc func()
~~~

### 1.3 Context 类型原型

~~~go
type Context interface {
 // Deadline返回的时间是代表该上下文所做的工作应该被取消的时间。如果没有设置截止日期，则返回ok==false。连续调用Deadline会返回相同的结果。
 Deadline() (deadline time.Time, ok bool)

  // Done返回一个channel通道，该通道代表完成工作时关闭取消上下文。需要在 select-case 语句中使用, case <-context.Done():
  // 如果上下文未关闭，Done返回nil。
  // 当context关闭后, Done返回一个被关闭的通道, 关闭仍然是可读的, goroutine可以接收到关闭请求
  // 连续调用Done将返回相同的值。Done通道的关闭可能会异步发生，当cancel函数返回。
 // 参考 https://blog.golang.org/pipelines 更多的示例
 Done() <-chan struct{}

  // 该方法描述 context 关闭的原因
 // 如果Done未关闭，Err返回nil。
  // 如果Done被关闭，Err返回一个非nil错误
 Err() error

  // 该方法根据 key 值查询map中 value
  // Value返回与此上下文关联的Value for key，或nil 如果没有value与key相关联。连续调用Value相同的键返回相同的结果。
 Value(key any) any
}
~~~

Context 一般携带一个截止日期、一个取消信号和其他跨越API边界的值。上下文的方法可以被多个 goroutine 同时调用。

### 1.4 Background() 方法原型

~~~go
var background = new(emptyCtx)
func Background() Context{
 return background
}
~~~

Background 函数返回一个非nil的空Context。它永远不会被取消，没有价值，也没有期限。它通常由主函数、初始化和测试使用，并作为传入请求的顶级上下文。

### 1.5 TODO() 方法原型

~~~go
var todo = new(emptyCtx)
func TODO() Context {
 return todo
}
~~~

TODO 函数返回一个非nil的空Context。代码应该使用上下文。当不清楚要使用哪个Context或者它还不可用时(因为周围的函数还没有扩展到接受Context参数)。

### 1.6 WithValue() 方法原型

~~~go
func WithValue(parent Context, key, val any) Context
~~~

WithValue 函数，返回父对象的副本，其中与键关联的值为val。

**上下文值只用于传递进程和api的请求范围内的数据，而不是传递可选参数给函数。**

提供的键必须具有可比性，不应该是string类型或任何其他内置类型，以避免使用上下文的包之间的冲突。使用WithValue的用户应该定义自己的键类型。在给接口`{}`赋值时，为了避免分配，上下文键通常有具体的类型`struct{}`。另外，导出的上下文关键变量的静态类型应该是指针或接口。

这个例子演示了使用 `context.WithValue()`函数，如何将值传递给上下文，以及如果值存在，如何检索它

~~~go
package main

import (
 "fmt"
 "context"
)

func main() {
 type favContextKey string
 f := func(ctx context.Context, k favContextKey) {
  if v := ctx.Value(k); v != nil {
   fmt.Println("found value:", v)
   return 
  }
  fmt.Println("key not found:", k)
 }
 key1 := favContextKey("key1")
 ctx := context.WithValue(context.Background(), key1, "Golang")
 f(ctx, key1)
 f(ctx, favContextKey("key2"))
}
~~~



## 2. context函数

### 2.1 WithCancel() 函数原型

~~~go
func WithCancel(parent Context) (ctx Context, cancel CancelFunc) {
  if parent == nil {
    panic("cannot create context from nil parent")
  }
  c := newCancelCtx(parent)
  propagateCancel(parent, &c)
  return &c, func() { c.cancel(true, Canceled) }
}
~~~

WithCancel 函数，返回带有新的 `Done()` 通道的父进程的副本。当返回的 cancel 函数被调用或父上下文的 `Done()` 通道被关闭时，返回上下文的 `Done()` 通道将被关闭，以哪个先发生为准。

取消此上下文将释放与其关联的资源，因此在此上下文中运行的操作完成后，代码应立即调用cancel。

**示例**

。

~~~go
package main

import (
	"context"
	"fmt"
	"time"
)

func handelrequest(ctx context.Context) {
	go writeredis(ctx)
	go writedatabase(ctx)
	for {
		select {
		case <-ctx.Done():
			fmt.Println("handelrequest done.")
			return
		default:
			fmt.Println("handelrequest running")
			time.Sleep(2 * time.Second)
		}
	}
}

func writeredis(ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			fmt.Println("writeredis done.")
			return
		default:
			fmt.Println("writeredis running")
			time.Sleep(2 * time.Second)
		}
	}
}

func writedatabase(ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			fmt.Println("writedatabase done.")
			return
		default:
			fmt.Println("writedatabase running")
			time.Sleep(2 * time.Second)
		}
	}
}

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	go handelrequest(ctx)

	time.Sleep(5 * time.Second)
	fmt.Println("it's time to stop all sub goroutines!")
	cancel()

	//just for test whether sub goroutines exit or not
	time.Sleep(5 * time.Second)
}

~~~

### 2.2 WithDeadline() 函数原型

~~~go
func WithDeadline(parent Context, d time.Time) (Context, CancelFunc) {
  if parent == nil {
    panic("cannot create context from nil parent")
  }
  if cur, ok := parent.Deadline(); ok && cur.Before(d) {
    // The current deadline is already sooner than the new one.
    return WithCancel(parent)
  }
  c := &timerCtx{
    cancelCtx: newCancelCtx(parent),
    deadline:  d,
  }
  propagateCancel(parent, c)
  dur := time.Until(d)
  if dur <= 0 {
    c.cancel(true, DeadlineExceeded) // deadline has already passed
    return c, func() { c.cancel(false, Canceled) }
  }
  c.mu.Lock()
  defer c.mu.Unlock()
  if c.err == nil {
    c.timer = time.AfterFunc(dur, func() {
      c.cancel(true, DeadlineExceeded)
    })
  }
  return c, func() { c.cancel(true, Canceled) }
}
~~~

WithDeadline 函数，返回父上下文的一个副本，其截止日期调整为不迟于d。如果父上下文的截止日期已经早于d, `WithDeadline(parent, d)` 在语义上等价于parent。当截止日期到期、调用返回的 cancel 函数或父上下文的 `Done()` 通道被关闭时，返回上下文的Done通道将被关闭，以先发生的情况为准。

取消此上下文将释放与其关联的资源，因此在此上下文中运行的操作完成后，代码应立即调用cancel。

**示例**

这个例子传递了一个带有任意截止日期的上下文，告诉阻塞函数一旦到达该时间就应该结束它的工作。

~~~go
package main

import (
 "fmt"
 "context"
 "time"
)

const shortDuration = 1 * time.Millisecond

func main() {
 d := time.Now().Add(shortDuration)
 ctx, cancel := context.WithDeadline(context.Background(), d)
 defer cancel()

 select {
 case <-time.After(1 * time.Second):
  fmt.Println("在截止时间之后停止")
 case <-ctx.Done():
  fmt.Println("在截止时间停止")
 }
}
~~~

### 2.3 WithTimeout() 函数原型

~~~go
func WithTimeout(parent Context, timeout time.Duration) (context, CancelFunc)
~~~

WithTimeout函数，返回 `WithDeadline(parent, time.Now().add(timeout))`

取消这个上下文会释放与之相关的资源，所以只要在这个上下文中运行的操作完成，代码就应该调用cancel:

~~~go
func slowOperationWithTimeout(ctx context.Context) (Result, error) {
 ctx, cancel := context.WithTimeout(ctx, 100*time.Millisecond)
 defer cancel()  // 如果slowOperation在超时之前完成，则释放资源
 return slowOperation(ctx)
}
~~~

**示例**

这个例子传递了一个带有超时的上下文，告诉阻塞函数在超时过后应该放弃它的工作。

~~~go
package main

import (
 "fmt"
 "context"
 "time"
)

const shortDuration = 1 * time.Millisecond

func main() {
 ctx, cancel := context.WithTimeout(context.Background(), shortDuration)
 defer cancel()

 select {
 case <-time.After(1 * time.Second):
  fmt.Println("在超时时间之后结束")
 case <-ctx.Done():
  fmt.Println("在超时时间结束")
 }
}
~~~

