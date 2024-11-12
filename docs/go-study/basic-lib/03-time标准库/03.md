# time标准库

> 时间在日常编程中使用非常多。time标准库中日历的计算采用的是公历

## 1. Time类型

* Time代表一个纳秒精度的时间点。

* 程序中应使用Time类型值来保存和传递时间，而不能用指针。就是说，表示时间的变量和字段，应为time.Time类型，而不是*time.Time.类型。

* 一个Time类型值可以被多个goroutine同时使用。

* 时间点可以使用`Before`、`After`和`Equal`方法进行比较。

* `Sub`方法让两个时间点相减，生成一个Duration类型值（代表时间段）。

* `Add`方法给一个时间点加上一个时间段，生成一个新的Time类型时间点。

* Time零值代表时间点January 1, year 1, 00:00:00.000000000 UTC。因为本时间点一般不会出现在使用中，`IsZero`方法提供了检验时间是否显式初始化的一个简单途径。

* 每一个时间都具有一个地点信息（及对应地点的时区信息），当计算时间的表示格式时，如`Format`、`Hour`和`Year`等方法，都会考虑该信息。

* `Local`、`UTC`和`In`方法返回一个指定时区（但指向同一时间点）的Time。修改地点/时区信息只是会改变其表示；不会修改被表示的时间点，因此也不会影响其计算。

~~~GO

func timeDemo() {
	now := time.Now() //获取当前时间
	fmt.Printf("current time:%v\n", now)

	year := now.Year()     //年
	month := now.Month()   //月
	day := now.Day()       //日
	hour := now.Hour()     //小时
	minute := now.Minute() //分钟
	second := now.Second() //秒
	//02d输出的整数不足两位 用0补足
	fmt.Printf("%d-%02d-%02d %02d:%02d:%02d\n", year, month, day, hour, minute, second)
}

~~~

## 2. 时间戳

时间戳是自1970年1月1日0时0分0秒至当前时间的总毫秒数。它也被称为Unix时间戳（UnixTimestamp）。

这里指的是UTC时间，比北京时间晚8个小时。

~~~go
func timestampDemo() {
    now := time.Now()            //获取当前时间
    timestamp1 := now.Unix()     //时间戳
    timestamp2 := now.UnixNano() //纳秒时间戳
    fmt.Printf("current timestamp1:%v\n", timestamp1)
    fmt.Printf("current timestamp2:%v\n", timestamp2)
}
~~~

## 3. Parse解析时间

~~~go
func Parse(layout, value string) (Time, error)
~~~

解析一个格式化的时间字符串并返回它代表的时间，如果缺少表示时区的信息，Parse会将时区设置为UTC。

~~~go
func ParseInLocation(layout, value string, loc *Location) (Time, error)
~~~

ParseInLocation类似Parse但有两个重要的不同之处。第一，当缺少时区信息时，Parse将时间解释为UTC时间，而ParseInLocation将返回值的Location设置为loc；第二，当时间字符串提供了时区偏移量信息时，Parse会尝试去匹配本地时区，而ParseInLocation会去匹配loc。



**`layout`的时间必须是`"2006-01-02 15:04:05"`这个时间，当然格式不一定是这个，时间一定得是，这是go诞生的时间**

~~~go

func timeParse() {
	t, err := time.Parse("2006-01-02 15:04:05", "2022-07-28 18:06:00")
	if err != nil {
		panic(err)
	}
	fmt.Println(t)
	now := time.Now()
	fmt.Println(now)
	// 加载时区
	loc, err := time.LoadLocation("Asia/Shanghai")
	if err != nil {
		fmt.Println(err)
		return
	}
	// 按照指定时区和指定格式解析字符串时间
	timeObj, err := time.ParseInLocation("2006/01/02 15:04:05", now.Format("2006/01/02 15:04:05"), loc)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(timeObj)

}
~~~

## 4. 格式化时间

~~~go
func (t Time) Format(layout string) string
~~~

Format根据layout指定的格式返回t代表的时间点的格式化文本表示。

~~~go

func timeFormat() {
	now := time.Now()
	// 格式化的模板为Go的出生时间2006年1月2号15点04分05秒
	// 24小时制
	fmt.Println(now.Format("2006-01-02 15:04:05.000"))
	// 12小时制
	fmt.Println(now.Format("2006-01-02 03:04:05"))
	fmt.Println(now.Format("2006/01/02 15:04"))
	fmt.Println(now.Format("15:04 2006/01/02"))
	fmt.Println(now.Format("2006/01/02"))
}
~~~

## 5. time.Unix()

~~~go
func Unix(sec int64, nsec int64) Time
~~~

Unix创建一个本地时间，对应sec和nsec表示的Unix时间（从January 1, 1970 UTC至该时间的秒数和纳秒数）。

nsec的值在[0, 999999999]范围内是合法的。

~~~go
func timestampDemo2(timestamp int64) {
    timeObj := time.Unix(timestamp, 0) //将时间戳转为时间格式
    fmt.Println(timeObj)
    year := timeObj.Year()     //年
    month := timeObj.Month()   //月
    day := timeObj.Day()       //日
    hour := timeObj.Hour()     //小时
    minute := timeObj.Minute() //分钟
    second := timeObj.Second() //秒
    fmt.Printf("%d-%02d-%02d %02d:%02d:%02d\n", year, month, day, hour, minute, second)
}
~~~

## 6. 时间间隔

time.Duration是time包定义的一个类型，它代表两个时间点之间经过的时间，以纳秒为单位。time.Duration表示一段时间间隔，可表示的最长时间段大约290年。

time包中定义的时间间隔类型的常量如下：

~~~GO
const (
    Nanosecond  Duration = 1
    Microsecond          = 1000 * Nanosecond
    Millisecond          = 1000 * Microsecond
    Second               = 1000 * Millisecond
    Minute               = 60 * Second
    Hour                 = 60 * Minute
)
~~~

例如：time.Duration表示1纳秒，time.Second表示1秒。

## 7. 时间计算

### 7.1 Add

~~~go
func (t Time) Add(d Duration) Time
~~~

Add返回时间点t+d。

~~~go
func main() {
    now := time.Now()
    later := now.Add(time.Hour) // 当前时间加1小时后的时间
    fmt.Println(later)
}
~~~

### 7.2  Sub

求两个时间之间的差值

~~~go
    func (t Time) Sub(u Time) Duration
~~~

返回一个时间段t-u。如果结果超出了Duration可以表示的最大值/最小值，将返回最大值/最小值。

要获取时间点t-d（d为Duration），可以使用t.Add(-d)。

~~~go
func main() {
    now := time.Now()
    later := now.Add(time.Hour) // 当前时间加1小时后的时间
    ret := later.Sub(now)
    fmt.Println(ret)
}
~~~

### 7.3  Equal

~~~go
    func (t Time) Equal(u Time) bool
~~~

判断两个时间是否相同，会考虑时区的影响，因此不同时区标准的时间也可以正确比较。

本方法和用t==u不同，这种方法还会比较地点和时区信息。

### 7.4 Before

~~~go
    func (t Time) Before(u Time) bool
~~~

如果t代表的时间点在u之前，返回真；否则返回假。

### 7.5 After

~~~go
    func (t Time) After(u Time) bool
~~~

如果t代表的时间点在u之后，返回真；否则返回假。

## 8. 定时器

使用time.Tick(时间间隔)来设置定时器，定时器的本质上是一个通道（channel）

~~~go
func tickDemo() {
    ticker := time.Tick(time.Second) //定义一个1秒间隔的定时器
    for i := range ticker {
        fmt.Println(i)//每秒都会执行的任务
    }
}
~~~

~~~go
time.AfterFunc(time.Second*10, func() {
		 fmt.Println("10秒后执行")
})

~~~

~~~go
package main
 
import (
    "fmt"
    "sync"
    "time"
)
 
/**
*ticker只要定义完成，从此刻开始计时，不需要任何其他的操作，每隔固定时间都会触发。
*timer定时器，是到固定时间后会执行一次
*如果timer定时器要每隔间隔的时间执行，实现ticker的效果，使用 func (t *Timer) Reset(d Duration) bool
 */
func main() {
    var wg sync.WaitGroup
    wg.Add(2)
    //NewTimer 创建一个 Timer，它会在最少过去时间段 d 后到期，向其自身的 C 字段发送当时的时间
    timer1 := time.NewTimer(2 * time.Second)
 
    //NewTicker 返回一个新的 Ticker，该 Ticker 包含一个通道字段，并会每隔时间段 d 就向该通道发送当时的时间。它会调  
   //整时间间隔或者丢弃 tick 信息以适应反应慢的接收者。如果d <= 0会触发panic。关闭该 Ticker 可            
   //以释放相关资源。
    ticker1 := time.NewTicker(2 * time.Second)
 
    go func(t *time.Ticker) {
        defer wg.Done()
        for {
            <-t.C
            fmt.Println("get ticker1", time.Now().Format("2006-01-02 15:04:05"))
        }
    }(ticker1)
 
    go func(t *time.Timer) {
        defer wg.Done()
        for {
            <-t.C
            fmt.Println("get timer", time.Now().Format("2006-01-02 15:04:05"))
            //Reset 使 t 重新开始计时，（本方法返回后再）等待时间段 d 过去后到期。如果调用时t     
            //还在等待中会返回真；如果 t已经到期或者被停止了会返回假。
            t.Reset(2 * time.Second)
        }
    }(timer1)
 
    wg.Wait()
}
~~~

