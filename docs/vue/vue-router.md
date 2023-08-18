## 功能回顾

**路由的两种模式**

- hash 通过锚点实现 （通过监听 onhashchange 事件实现 router）
- history 通过 HTML5 中的 api （pushState replaceState 实现 router）

## 原理

**安装 VueRouter 时做的事**

- 注册组件 router-link、router-view
- 混入 beforeCreate 钩子，将传入 Vue 的 router 对象挂载到 Vue 原型上（所以根实实例 vm.$router 为空）

**实例化 VueRouter 时做的事**

- 创建路径和 RouteRecord 的映射表

![路由映射表](/blog/img/router-1.png)

- 根据 mode 实例化对应的 history

**根实例 beforeCreate 时做的事**

- 执行 router.init 方法，然后执行 history.transitionTo 方法做路由过渡
- transitionTo 会执行 match 方法匹配到与 url 对应的 RouteRecord，然后创建出当前 Route（transitionTo 就是用来实现路径切换的，router.push 和 router.replace 本质也是调用了 transitionTo 方法）

![路由映射表](/blog/img/router-2.png)

![路由映射表](/blog/img/router-3.png)

- transitionTo 得到 Route 后会调用 confirmTransition 方法完成路径跳转。

![路由映射表](/blog/img/router-4.png)

- confirmTransition 会拿到所有的导航守卫钩子放到一个队列中

![路由映射表](/blog/img/router-5.png)

- 拿到所有的钩子队列之后通过 runQueue 依次执行所有钩子

![路由映射表](/blog/img/router-6.png)

- 钩子执行完成后调用 onComplete 回调钩子实现路径切换 且 更新当前路由 current

![路由映射表](/blog/img/router-7.png)

![路由映射表](/blog/img/router-8.png)

- 然后 route-view 渲染对应的组件（通过 depth 和 RouteRecord.matched）

![路由映射表](/blog/img/router-9.png)
