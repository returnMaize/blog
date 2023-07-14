## 介绍

之间我们了解了 `eslint` 工具，它是用来检查我们 EcmaScript 的代码是否符合规范（当然它也可以配合插件完成对其他如 Vue、TypeScript 等检查）。在此基础上，我想你应该通过名字 `commitlint` 猜到它的功能了。没错，`commitlint` 就是用来对我们代码提交时的信息进行检查。

在没有使用 `commitlint` 工具之前，我们提交代码时的信息可能是这样的

```bash
git commit -m '新增了xxx'
git commit -m '解决了xxx的缺陷'
git commit -m '今日阳光明媚，今日多云转晴'
```

使用 `commitlint` 工具之后，我们提交代码时的信息就是这样的

```bash
git commit -m 'feat: 新增 commitlint.config.js 配置文件'
git commit -m 'fix(route): 修复路径错误'
git commit -m 'style(README): 文案调整'
```

可以看到，使用 `commitlint` 之后。我们可以通过提交信息和清晰的了解到这次提交的变更，拿 `fix(route): 修复路径错误` 为例。`fix` 表示我们这次提交是缺陷的修复，`(route)` 表示我们这次修复的缺陷涉及到的模块在 route 中，最后 `修复路径错误` 为导致我们这次缺陷的原因。

通过 `commitlint` 和提交规范我们可以很好的约束其他人的提交信息，便于理解他这次提交变更了那些内容。这在协同开发中是非常有用的。

## 安装

### 本地安装

```bash
npm install --save-dev @commitlint/config-conventional @commitlint/cli
```

### 新增配置文件

与 `eslint` 一样，`commitlint` 同样也需要一个配置文件告诉它该以什么样的规范去检查我们的提交信息。

commitlint.config.js

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
}
```

通过以上配置，`commitlint` 便会以 `conventional commits` 规范进行校验，如果提交信息不符合常规的提交规范，那么此次提交将会失败。如果你想了解更多关于常规规范的内容，可以阅读 [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

## 使用

通过前面我们可以了解到 `commitlint` 是用来检查我们提交信息是否符合规范，那它检查的时机必定是在我们提交信息 时执行。这时我们肯定第一时间想到 `git hooks`，它会在特定的时间执行。我们可以通过访问隐藏文件 `.git` 来查看到所有的 `git hooks`。

```bash
cd yourproject
cd .git/hooks/
ls
# result
applypatch-msg.sample           pre-push.sample
commit-msg.sample               pre-rebase.sample
fsmonitor-watchman.sample       pre-receive.sample
post-update.sample              prepare-commit-msg.sample
pre-applypatch.sample           push-to-checkout.sample
pre-commit.sample               update.sample
pre-merge-commit.sample
```

我们可以通过修改这些脚本文件使得 `commitlint` 能在信息提交时执行，但这样是愚蠢的。因为不是所有的开发者都擅长脚本编写，并且这些脚本文件在 `.git` 文件中，它属于隐藏文件。我们不可能通过此方式去完成提交信息的检查。令人庆幸的是，npm 库中存在这么一个工具 `husky`。它支持所有的 `git hooks`，通过它我们便可以在修改隐藏文件 `.git` 的情况下使用 `git hooks`。

#### 安装 husky

```bash
npm install husky --save-dev
```

启用 git hooks

```bash
npx husky install
```

package.json 在项目安装依赖前需要启用 git hooks，这在协同开发中很重要，如果你不了解 `preare`，可以同构查看 [npm docs](https://docs.npmjs.com/cli/v7/using-npm/scripts) 进行了解

```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

新增 `git hooks` 中的 `commit-msg` 钩子，并在这个钩子中执行 `commitlint` 进行提交信息检查

```bash
npx husky add .husky/commit-msg  'npx --no -- commitlint --edit ${1}'
```

到此我们便完成了 `commitlint` 的所有配置

## 测试

首先我们新增一个 `test.js` 文件

```bash
touch test.js
```

将它添加到暂存区

```bash
git add .
```

最后提交到仓库，这里我们随意使用一个提交信息

```bash
git commit -m '新增了一个 test.js 文件'
```

命令行结果

```bash
⧗   input: 新增了一个 test.js 文件
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]

✖   found 2 problems, 0 warnings
ⓘ   Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint

husky - commit-msg hook exited with code 1 (error)
```

按规范提交

```bash
git commit -m 'feat(global): 新增一个 test.js 文件'
```

命令行结果

```bash
[master 557f558] feat(global): 新增一个 test.js 文件
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 test.js
```
