(window.webpackJsonp=window.webpackJsonp||[]).push([[46],{319:function(t,r,o){"use strict";o.r(r);var e=o(14),i=Object(e.a)({},(function(){var t=this,r=t._self._c;return r("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[r("h2",{attrs:{id:"功能回顾"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#功能回顾"}},[t._v("#")]),t._v(" 功能回顾")]),t._v(" "),r("p",[r("strong",[t._v("路由的两种模式")])]),t._v(" "),r("ul",[r("li",[t._v("hash 通过锚点实现 （通过监听 onhashchange 事件实现 router）")]),t._v(" "),r("li",[t._v("history 通过 HTML5 中的 api （pushState replaceState 实现 router）")])]),t._v(" "),r("h2",{attrs:{id:"原理"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#原理"}},[t._v("#")]),t._v(" 原理")]),t._v(" "),r("p",[r("strong",[t._v("安装 VueRouter 时做的事")])]),t._v(" "),r("ul",[r("li",[t._v("注册组件 router-link、router-view")]),t._v(" "),r("li",[t._v("混入 beforeCreate 钩子，将传入 Vue 的 router 对象挂载到 Vue 原型上（所以根实实例 vm.$router 为空）")])]),t._v(" "),r("p",[r("strong",[t._v("实例化 VueRouter 时做的事")])]),t._v(" "),r("ul",[r("li",[t._v("创建路径和 RouteRecord 的映射表")])]),t._v(" "),r("p",[r("img",{attrs:{src:"/blog/img/router-1.png",alt:"路由映射表"}})]),t._v(" "),r("ul",[r("li",[t._v("根据 mode 实例化对应的 history")])]),t._v(" "),r("p",[r("strong",[t._v("根实例 beforeCreate 时做的事")])]),t._v(" "),r("ul",[r("li",[t._v("执行 router.init 方法，然后执行 history.transitionTo 方法做路由过渡")]),t._v(" "),r("li",[t._v("transitionTo 会执行 match 方法匹配到与 url 对应的 RouteRecord，然后创建出当前 Route（transitionTo 就是用来实现路径切换的，router.push 和 router.replace 本质也是调用了 transitionTo 方法）")])]),t._v(" "),r("p",[r("img",{attrs:{src:"/blog/img/router-2.png",alt:"路由映射表"}})]),t._v(" "),r("p",[r("img",{attrs:{src:"/blog/img/router-3.png",alt:"路由映射表"}})]),t._v(" "),r("ul",[r("li",[t._v("transitionTo 得到 Route 后会调用 confirmTransition 方法完成路径跳转。")])]),t._v(" "),r("p",[r("img",{attrs:{src:"/blog/img/router-4.png",alt:"路由映射表"}})]),t._v(" "),r("ul",[r("li",[t._v("confirmTransition 会拿到所有的导航守卫钩子放到一个队列中")])]),t._v(" "),r("p",[r("img",{attrs:{src:"/blog/img/router-5.png",alt:"路由映射表"}})]),t._v(" "),r("ul",[r("li",[t._v("拿到所有的钩子队列之后通过 runQueue 依次执行所有钩子")])]),t._v(" "),r("p",[r("img",{attrs:{src:"/blog/img/router-6.png",alt:"路由映射表"}})]),t._v(" "),r("ul",[r("li",[t._v("钩子执行完成后调用 onComplete 回调钩子实现路径切换 且 更新当前路由 current")])]),t._v(" "),r("p",[r("img",{attrs:{src:"/blog/img/router-7.png",alt:"路由映射表"}})]),t._v(" "),r("p",[r("img",{attrs:{src:"/blog/img/router-8.png",alt:"路由映射表"}})]),t._v(" "),r("ul",[r("li",[t._v("然后 route-view 渲染对应的组件（通过 depth 和 RouteRecord.matched）")])]),t._v(" "),r("p",[r("img",{attrs:{src:"/blog/img/router-9.png",alt:"路由映射表"}})])])}),[],!1,null,null,null);r.default=i.exports}}]);