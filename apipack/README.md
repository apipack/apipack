# APIPACK

> To pack everything to be every API.

Apipack is a HTTP service code-gen/bundler tool for Frontend. Its main purpose is to auto-generate Frontend JavaScript/TypeScript service code by analyzing Backend controller routes, params, return values, and type definitions.

## DESIGN

### Plugins

It watches the specified glob syntax path and uses the corresponding backend server language adapter to outputs `HTTPServiceModules`.

- for webpack: @apipack/webpack
- for vite: @apipack/vite

### Adapters

It analyses the corresponding backend source code and outputs `HTTPServiceModules`. Some of the below listed is just for example that does not mean we will implement those all.

For Java:

- @apipack/java
- @apipack/spring-boot
...

For JavaScript:

- @apipack/javascript
- @apipack/express
- @apipack/nest
...

For Go:

- @apipack/go

For Python:

- @apipack/python
- @apipack/flask
- @apipack/django

### Generators

It consumes `HTTPServiceModules` to generate them be any language style like `HTTPServices` code written by JavaScript or TypeScript in FrontEnds.

- @apipack/generator
  - typescript
  - javascript
 ...

## Usage

1. Register the `plugin` to your project build tools flow, whatever `Webpack` or `Vite`.
2. Choose a specified language adapter for your backend project, for example, `adapter: 'SpringBOOT'`.
3. Inject the import header code to your code generator, and use interceptor to concatenate the final service code.

## Question?

1. How to design the interface of CodeGen? Use AST? or just String concatenate?
2. How to design the interceptor of per `HTTPServiceModules` and `HTTPServices`?

## Thanks

- [AST Explorer](https://astexplorer.net/)
- [Chevrotain](https://github.com/Chevrotain/chevrotain)
- [java-parser](https://github.com/jhipster/prettier-java/tree/main/packages/java-parser)
- [Nodemon](https://www.npmjs.com/package/nodemon)
