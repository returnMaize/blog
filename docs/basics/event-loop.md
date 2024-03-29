## 浏览器渲染进程（内核）

作用：负责解析页面和渲染页面、脚本执行等

### 常见线程

- GUI 线程（负责解析渲染 html、css）
- JS 引擎线程 （JS 代码执行）
- 定时器触发线程（计时）
- 异步 HTTP 线程（接口请求）
- 事件触发线程（任务队列）

## 事件循环

JS 引擎执行代码顺序

- JS 引擎线程：整个代码块作为一个宏任务放入执行栈中执行
  - 同步代码从上到下依次执行
  - 异步任务放入宏任务队列和微任务队列（暂不执行）
  - 执行完所有同步代码
- JS 引擎线程：按需执行微任务队列中所有微任务
  - 先进入队列的微任务先执行
  - 执行期间发现其他微任务放到队列最后
  - 执行完队列中所有微任务
- GUI 线程介入：渲染一次页面
- 事件触发线程介入：取出宏任务队列中的第一个任务放到执行栈
  - 完成一次事件循环
  - 无限循环直到所有任务都执行完毕
