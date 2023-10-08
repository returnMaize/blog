## 特点

- 天生支持并发
- 语法简单，容易上手
- 内置 runtime，支持垃圾回收（GC）
- 可以直接编译成机械码，不依赖其他库
- 跨平台编译

## 安装

**傻瓜式一键安装**

> 地址：https://go.dev/dl/

## 设置环境变量

```bash
# 查看环境变量
go env

# 配置环境变量（Mac）；缺点：关闭终端或重启电脑后环境变量失效
export GO111MODULE=on

# go 版本 >= 1.13 配置环境变量（持久配置）
go env -w GO111MODULE=on

# 配置 go 拉包代理
go env -w GOPROXY=http://goproxy.cn
```

## goroot 和 gopath

goroot: go 安装目录

gopath: go 项目所在路径（高版本的 go 不再使用 gopath 来管理项目，使用 go mod 来管理项目）

## go 编辑器

**常用编辑器**

- go lang（收费）
- vs code（推荐）

**vs code 推荐插件**

- go（语法提示）
- Code Runner （代码运行）

## go 常用命令

- go build（编译 go 源码为二进制文件）
- go run（运行 go 代码）
- go get（安装依赖）
- go install（和 go get 类似
