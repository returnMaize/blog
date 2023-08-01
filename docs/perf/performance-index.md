## RAIL 性能模型

> RAIL, 是 Response, Animation, Idle, 和 Load 的首字母缩写, 是一种由 Google Chrome 团队与 2015 年提出的性能模型, 用于提升浏览器内的用户体验和性能. RAIL 模型的理念是 "以用户为中心；最终目标不是让您的网站在任何特定设备上都能运行很快，而是使用户满意。

通俗点说就是通过对 Response（响应）、Animation（动画）、Idle（空闲）、Load（加载）这四个方面的期望，让用户在使用应用时感觉很快。

**Response（响应）**

响应用户操作应控制在 50ms 内。

**Animation（动画）**

应在 10ms 内生成一帧。现代浏览器大多为 60 帧，这样算下来，一帧的时间为 1000/60 约等于 16ms，但是考虑到动画的绘制需要花费 6ms 左右，所以一帧应在 10ms 左右

**Idle（空闲）**

- 利用空闲时间完成延缓的工作。例如，对于初始页面加载，应加载尽可能少的数据，然后利用空闲时间加载其余数据。

- 在 50 毫秒或更短的空闲时间内执行工作。如果时间更长，您可能会干扰应用在 50 毫秒内响应用户输入的能力。

- 如果用户在空闲时间工作期间与页面交互，则应中断空闲时间工作，用户交互始终具有最高优先级。

**Load（加载）**

应在 5 秒内加载完内容并实现可交互

- 根据用户的设备和网络能力优化相关的快速加载性能。目前，对于首次加载，在使用速度较慢 3G 连接的中端移动设备上，理想的目标是在 5 秒或更短的时间内实现可交互。

- 对于后续加载，理想的目标是在 2 秒内加载页面。

**[参考链接](https://web.dev/rail/)**

## 性能指标

**TTFB（Time to First Byte 第一字节时间）**

应用的请求从发起到第一个字节响应的时间

- TTFB 在 800ms 以内为优秀
- TTFB 在 800ms 到 1800ms 之前为良好（需要改进）
- TTFB 超过 1800md 那就比较差了

![TTFB](/img/TTFB.jpg)

**FCP（First Contentful Paint 首次内容绘制）**

页面从加载到页面上第一个内容渲染成功的时间

![FCP](/img/FCP.jpg)

**LCP（Largest Contentful Paint 最大内容绘制）**

页面从加载到主要内容渲染成功的时间

![LCP](/img/LCP.jpg)

**[了解更多性能指标](https://web.dev/metrics/)**

## web 核心性能指标

- LCP 追踪加载速度
- FID 是追踪网站响应性
- CLS 追踪视觉稳定性

### Largest Contentful Paint 最大内容绘制 (LCP)

页面从加载到主要内容渲染成功的时间

![LCP](/img/LCP.jpg)

**影响 LCP 的因素**

- 服务器响应速度
- js 和 css 加载阻塞
- 资源加载速度
- 浏览器渲染速度

**优化 LCP 的方式**

- 资源的压缩
- 代码分割

### First Input Delay 首次输入延迟 (FID)

用户首次和页面进行交互到浏览器真正处理用户行为的时间

![FID](/img/FID.jpg)

**优化 FID 的方式**

- 减少 JS 执行时间

### Cumulative Layout Shift 累积布局偏移 (CLS)

布局偏移一般都是由于图像视频类的资源加载导致的

![CLS](/img/CLS.jpg)

**优化 CLS 的方式**

- 给图像添加固定宽高
- 动画过渡

### 性能指标测量工具

- web vitals（Chrome 插件）
- lighthouse（Chrome 自带）
- webpagetest.org（网页版）

**web vitals**

![web vitals](/img/web-vitals.jpg)
