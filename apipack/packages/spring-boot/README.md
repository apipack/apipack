# Apipack-SpringBOOT

Apipack-SpringBOOT is a HTTP service codegen/bundler tools for Java. Its main purpose is to auto generate Frontend JavaScript/TypeScript service code through analyse Backend controller routes and their params, return values, type definitions.

Apipack-SpringBOOT 是 http 服务代码 生成/打包 工具。它的主要目的是通过分析后端的 controller 路由和它们的参数、返回值、类型声明，自动生成前端 JavaScript/TypeScript 的服务代码。

## Implementations

Lexer -> source code -> tokens -> CST -> parser -> ast -> visitor -> collector -> generate JS/TS code

### Java

0. chevrotain.createToken 创建需要被解析的 tokens
1. chevrotain.Lexer 接收 输入的 source code 生成 CST
2. 通过 parser + visitor 读取 CST 中的 @RestController/@Controller/@PathVariable/@RequestBody 声明
3. 通过 controller 声明读取 api path/params/return values/type definitions
4. 读取完成后生成 JavaScript Service 代码

#### SpringMVC

#### SpringBoot Framework

1. 编写前端构建工具的插件监听 /\*Controller.java 文件的修改
2. 一旦监听到新的变动则生成新的 Service 代码和类型声明

## Refs

- [AST Explorer](https://astexplorer.net/)
- [Chevrotain](https://github.com/Chevrotain/chevrotain)
- [java-parser](https://github.com/jhipster/prettier-java/tree/main/packages/java-parser)
- [What is the difference between an Abstract Syntax Tree and a Concrete Syntax Tree?](https://stackoverflow.com/questions/1888854/what-is-the-difference-between-an-abstract-syntax-tree-and-a-concrete-syntax-tre)
- [lexers vs parsers](https://stackoverflow.com/questions/2842809/lexers-vs-parsers?noredirect=1)
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [TypeScript Unit Testing 101: A Developer’s Guide](https://www.testim.io/blog/typescript-unit-testing-101/)
- [Setting up a monorepo with Lerna for a TypeScript project](https://blog.logrocket.com/setting-up-monorepo-with-lerna-typescript/)
- [Lerna.js monorepo](https://lerna.js.org/)