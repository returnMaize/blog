## 介绍

定义栈的数据结构，请在该类型中实现一个能够得到栈的最小元素的 min 函数在该栈中，调用 min、push 及 pop 的时间复杂度都是 O(1)。

## 思路

- 时间复杂度必须为 O(1)，所以不能使用遍历。那我们就必须在入栈的时候记录最小值
- 栈有进有出，所以我们应该使用数组来记录每个阶段的最小值

## 实现

```js
class MinStack {
  constructor() {
    this.stack = []
    this.count = 0

    this.minStack = []
    this.minStackCount = 0
  }

  push(value) {
    // 入 minStack 栈条件（当前值是最小值 ｜ 首次入栈）
    if (this.isEmty() || this.min() >= value) {
      this.minStack[this.minStackCount++] = value
    }
    this.stack[this.count++] = value
    return value
  }

  pop() {
    if (!this.isEmty()) {
      // 不为空删除
      const res = this.stack[this.count - 1]
      // 删除主栈
      delete this.stack[--this.count]
      // 如果删除的值是最小值，则删除 minStack 栈顶
      if (res === this.min()) {
        delete this.minStack[--this.minStackCount]
      }
      return res
    }
  }

  top() {
    return this.stack[this.count - 1]
  }

  isEmty() {
    return this.count === 0
  }

  min() {
    return this.minStack[this.minStackCount - 1]
  }
}
```
