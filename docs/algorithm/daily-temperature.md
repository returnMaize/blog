## 介绍

**每日温度**

请根据每日 气温 列表 temperatures ，重新生成一个列表，要求其对应位置的输出为：要想观测到更高的气温，至少需要等待的天数。如果气温在这之后都不会升高，请在该位置用 0 来代替。

**示例**

输入: temperatures = [73,74,75,71,69,72,76,73]

输出: [1,1,4,2,1,1,0,0]

## 思路

- 遍历温度列表，使用一个单调递减栈维护温度值
- 每次遍历会比较栈顶值是否小于当前值，如果小于移除栈顶值（得到结果），一直比较到栈为空。
- 每次比较都会当前值压入栈中

## 代码实现

```js
var dailyTemperatures = function (temperatures) {
  // 维护一个单调递减栈，存放温度值的下标，方便计算
  const stack = []

  const len = temperatures.length

  // 返回结果，默认都是 0
  const res = Array(len).fill(0)

  for (let i = 0; i < len; i++) {
    const currentVal = temperatures[i]

    // 循环递归比较栈顶值和当前值，如果当前值大于栈顶值就计算栈顶值结果，知道清空栈
    while (
      stack.length &&
      temperatures[(stackTopVal = stack[stack.length - 1])] < currentVal
    ) {
      stack.pop()
      res[stackTopVal] = i - stackTopVal
    }

    stack.push(i)
  }

  return res
}
```
