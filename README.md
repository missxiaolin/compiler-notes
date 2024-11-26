# Babel 与编译原理详解

## Babel 有了解过吗，请说说 Babel 的基础使用和原理？

了解过

babel 用来作什么的？

- 将高版本(ESMA) js 转为低版本 js
- 将 Typescript 转为 js
- 降级处理，polyfill，vite esbuild、rollup

- taro 早期，就是使用 babel 将 nerv、react 语法转为小程序 <div> -> <View>
- 自己想要的语法支持，options chain ?.

### 基础使用

babel、webpack，都有两种使用途径：1. 命令行、2. node 环境下的 api

- @babel/cli

插件化机制实现、预设机制

- @babel/plugin-transform-arrow-functions
- @babel/plugin-transform-instanceof

但是，为了给开发者足够的便捷，babel 又在插件的基础上封装了一层，预设

- @babel/preset-env
- @babel/preset-react

代码中没有新意，函数、对象、变量、分支语句

## 有没有了解过编译原理，了解过编译器的底层实现吗？

let x = 10 + 20
let f = () => 1

我现在的需求就是，将它转为：var x = 10 + 20，var f = function () {return 1}

```js
const code = `let x = 10 + 20`;
```

代码的本质是什么？
**字符串**

编译，其实就是字符串的操作

字符串语义化一些，语句、说话

“大家好，欢迎来到妙码，我是合一！”
我是妙码的独家签约讲师合一，大家好

中文有语法，英文也有语法，主谓宾、定状补，这些词连接起来组成句子，才能把事物说明白。

分词（token）

1. 大 家 好 ， 欢 迎 来 到 小 林 ， 我 是 林 林 ！
   语法（ast Abstract Syntax Trees 抽象语法树）
2. 大家 好 ， 欢迎 来到 小林 ， 我 是 林林 ！
   语义
3. 表达 semanticAnalysis
   生成（generate） or 执行（interpret）

4. 将句子劈开，—— 分词，tokenizer 分词器
5. 将分词连接，—— 语法分析，parser
6. 将分词处理理解，—— 语义分析，
7. 生成器 generator、执行器 interpretor（飞书表格公式执行器就是执行器）

程序里面没有什么特征是不能用 json 来描述的

- 低代码平台 -> dsl domain specific language
- 代码 -> ast Abstract Syntax Trees

代码（code）、低代码物料（block、blocksuite）、流程（node + edge flow）

## 从零到一架构实现一个类似飞书表格公式字段编译执行器，请简要说说你的设计思路

1. 富文本编辑器 -> 光标处理、框选处理
2. 语法高亮+自动补全 -> LSP，monaco-editor Language Server Protocal
3. 自动补全
4. 编译
5. 执行
