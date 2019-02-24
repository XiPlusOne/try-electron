使用 [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate#readme) 玩一下 [Electron](https://electronjs.org/)，姑且粗略模仿了一下网易云音乐的唱片机。

可以点击左下角上传音轨文件，上传后点击开始播放。目前仅支持 flac 文件。

flac 文件上传时我会对其进行解码，目前仅提取了封面，以后会扩展更多功能。

## 安装

```bash
$ yarn
```

## 开发

```bash
$ yarn dev
```

## 打包

```bash
$ yarn package
```

## web 端打包

```bash
$ yarn build-web
```

## 在浏览器上查看

```bash
$ yarn browse
```

查看前必须先打包

## 命令说明

在 package.json 的 scripts 中，electron-react-boilerplate 自带大量命令，我也加了少量，这里给出详细说明以备忘。

### 工具清单

这里先给出使用到的工具的清单，后面不一一说明。

- [node](https://nodejs.org/en/) 众所周知的 JS 运行环境
- [electron](https://electronjs.org/) 用 Web 端技术开发桌面应用，使用 V8 和 Chromium 引擎
- [electron-builder](https://www.npmjs.com/package/electron-builder) electron 的打包工具
- [yarn](https://yarnpkg.com/en/) 众所周知的依赖管理工具
- [webpack](https://webpack.js.org/) 众所周知的打包工具，功能繁多
- [webpack-dev-server](https://www.npmjs.com/package/webpack-dev-server) webpack 提供的开发辅助工具
- [@babel/register](https://babeljs.io/docs/en/next/babel-register.html) 挂在 node 的 require 方法上，自动解析语法
- [flow](https://flow.org/) 静态类型检测工具
- [flow-typed](https://github.com/flow-typed/flow-typed) 用来导入依赖库的类型
- [eslint](https://eslint.org/) 优化代码书写的工具
- [stylelint](https://www.npmjs.com/package/stylelint) 优化 CSS 书写的工具
- [prettier](https://prettier.io/) 美化代码格式的工具
- [husky](https://www.npmjs.com/package/husky) 可以取消向 git 提交的工具
- [lint-staged](https://www.npmjs.com/package/lint-staged) 向 git 提交代码前进行 lint 的工具
- [jest](https://jestjs.io/) 测试工具
- [testcafe](https://devexpress.github.io/testcafe/) 端对端测试的工具
- [testcafe-live](https://www.npmjs.com/package/testcafe-live) testcafe 的一个观察模式工具
- [cross-env](https://www.npmjs.com/package/cross-env) 用于设置环境变量的工具
- [concurrently](https://www.npmjs.com/package/concurrently) 用于优化并发执行体验的工具
- [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) 将输出的各个包的尺寸视图化
- [chalk](https://www.npmjs.com/package/chalk) 使终端显示的文本更漂亮的工具
- [detectPort](https://www.npmjs.com/package/detect-port) 端口占用检测工具
- [rimraf](https://www.npmjs.com/package/rimraf) 文件清理工具，rm -rf 的谐音
- [opencollective-postinstall](https://www.npmjs.com/package/opencollective-postinstall) 打印募捐信息的工具

### build

```bash
$ concurrently "yarn build-main" "yarn build-renderer"
```

同时运行 yarn build-main 以及 yarn build-renderer

electron 有一条主进程用来运行窗口，每个 Tab 页占用一条渲染进程。[相关阅读](https://electronjs.org/docs/tutorial/application-architecture)

### build-main

```bash
$ cross-env NODE_ENV=production webpack --config ./configs/webpack.config.main.prod.babel.js --colors
```

entry 是 ./app/main.dev ，output 是./app/main.prod.js，用来跑 electron 的主进程。./app/main.prod.js 也是应用入口。在这个文件里，同目录的 app.html 文件会被渲染。

### build-renderer

```bash
$ cross-env NODE_ENV=production webpack --config ./configs/webpack.config.renderer.prod.babel.js --colors
```

entry 是 ./app/index.js output 是 ./app/dist/renderer.prod.js。刚才在主进程中渲染的 app.html 会去请求此文件。这一步已经隔离了 electron 这个环境，之后都是纯 web 开发。

### build-web

```bash
$ rimraf ./app/dist-web/**.* && cross-env NODE_ENV=production OPEN_ANALYZER=true webpack --config ./configs/webpack.config.web.prod.babel.js --colors
```

进行一次目标为 web 端的打包，重视资源尺寸，打包完毕后会打开资源分析工具

### browse

```bash
$ http-server ./app/dist-web/ -o
```

在浏览器中查看 build-web 命令打的包

### dev

```bash
$ cross-env START_HOT=1 node -r @babel/register ./internals/scripts/CheckPortInUse.js && cross-env START_HOT=1 yarn start-renderer-dev
```

其中./internals/scripts/CheckPortInUse.js 是检查端口占用的，因为使用了 import 等 node 不支持的语法，所以必须预载入@babel/register 才能跑。

### start-renderer-dev

```bash
$ cross-env NODE_ENV=development webpack-dev-server --config configs/webpack.config.renderer.dev.babel.js
```

这里会检测是否存在 dll，如果不存在就 execSync build-dll 命令。在 devServer 的 before 配置下会先 spawn 一个子进程跑 start-main-dev 命令。entry 是一个数组，分别是：

- [react-hot-loader/patch](https://github.com/gaearon/react-hot-loader/blob/master/src/index.dev.js) ：根据环境变量选择导出生产或开发用版本，会直接修改 React 和 ReactDOM 对象
- [webpack-dev-server/client?http://localhost:\${port}/](https://github.com/webpack/webpack-dev-server/blob/master/client-src/default/index.js) ：在客户端初始化 webpack-dev-server 的代码，调用./socket.js 进行前后端通信，其内容我瞟了一眼，应该是使用了[sockjs-client](https://www.npmjs.com/package/sockjs-client)这个工具
- [webpack/hot/only-dev-server](https://github.com/webpack/webpack/blob/master/hot/only-dev-server.js) ：在客户端监听 HMR
- ./app/index.js

我不清楚上方为什么要这么配置，根据 webpack 文档，似乎仅需要最后一个 entry 就够了。但是当我去掉前三条 entry 时，虽然 HMR 的功能没有问题，但是每次更新时 shell 就会打印出如下错误：

"Uncaught (in promise) Error: Could not instantiate: ProductRegistryImpl.Registry", source: chrome-devtools://devtools/bundled/shell.js (106)

所以我推测这是对这个问题的一种解决方案。但是我决定不在这个问题上纠结。

### build-dll

```bash
$ cross-env NODE_ENV=development webpack --config ./configs/webpack.config.renderer.dev.dll.babel.js --colors
```

一次性生成所有依赖。entry 是 package.json 里的 dependencies 下的所有模块，output 是./dll/renderer.dev.dll.js。处于开发模式时，./app/app.html 会去请求这个文件。同时还会生成一个 render.json 的清单文件供以后使用。

### start-main-dev

```bash
$ cross-env HOT=1 NODE_ENV=development electron -r @babel/register ./app/main.dev.js
```

跑一个 electron 主进程，前面提到过，因为使用了 import 语法，所以要预载入@babel/register。

### start

```bash
$ cross-env NODE_ENV=production electron ./app/main.prod.js
```

用 electron 跑生产模式的包，跑之前要先 yarn build。但因 prestart 命令已经定义成 yarn build 了，所以并不需要真的手动运行一次。

### prestart

```bash
$ yarn build
```

见 yarn start 的说明

### test

```bash
$ cross-env NODE_ENV=test BABEL_DISABLE_CACHE=1 jest
```

单元测试、快照测试等，测试的部分后面会单独提到。

### flow

```bash
$ flow
```

类型检测，目前逻辑代码基本都有覆盖。

### flow-typed

```bash
$ rimraf flow-typed/npm && flow-typed install --overwrite || true
```

这个命令用来导入依赖库的类型以备使用

### lint

```bash
$ cross-env NODE_ENV=development eslint --cache --format=pretty .
```

用来优化代码书写，配合 IDE 插件使用更佳。

### lint-fix

```bash
$ yarn --silent lint --fix && exit 0
```

尝试自动修复代码书写的瑕疵。

### postlint-fix

```bash
$ prettier --ignore-path .eslintignore --single-quote --write "**/*.{*{js,jsx,json},babelrc,eslintrc,prettierrc,stylelintrc}"
```

自动跟在 lint-fix 命令后面执行，对代码进行美化。

### lint-styles

```bash
$ stylelint --ignore-path .eslintignore "**/*.{css,scss,less}"
```

优化 CSS 的书写，配合 IDE 插件使用效果更加。

### lint-styles-fix

```bash
$ yarn --silent lint-styles --fix && exit 0
```

尝试自动修复 CSS 代码书写的瑕疵。

### postlint-styles-fix

```bash
$ prettier --ignore-path .eslintignore --single-quote --write "**/*.{css,scss,less}"
```

自动跟在 lint-styles-fix 命令后面执行，对 CSS 代码进行美化。

### test-watch

```bash
$ yarn test --watch
```

观察模式的测试，可以边测边改。

### test-e2e

```bash
$ node -r @babel/register ./internals/scripts/CheckBuiltsExist.js && cross-env NODE_ENV=test testcafe electron:./ ./test/e2e/DiscPlayerPage.e2e.js
```

用来跑端对端测试，遗憾的是，目前还跑不了，因为脚本点击播放音乐时会被安全策略拦截导致无法播放，导致无法完整测试。对 testcafe 我还未深入学习，这个问题待解决。必须先跑一次 yarn build-e2e 才能用这个命令。

### test-e2e-live

```bash
$ node -r @babel/register ./internals/scripts/CheckBuiltsExist.js && cross-env NODE_ENV=test testcafe-live electron:./ ./test/e2e/DiscPlayerPage.e2e.js
```

使用观察模式跑端对端测试，可以一边改一边测。必须先跑一次 yarn build-e2e 才能用这个命令。

### build-e2e

```bash
$ cross-env E2E_BUILD=true START_MINIMIZED=true yarn build
```

端对端测试前要先跑一次这个。

### test-all

```bash
$ yarn lint && yarn lint-styles && yarn flow && yarn build && yarn test
```

一次性跑一遍所有测试、lint、lint-styles、flow。

### package

```bash
$ yarn build && electron-builder build --publish never
```

打包 electron 桌面应用。

### postinstall

```bash
$ yarn flow-typed && electron-builder install-app-deps package.json && yarn build-dll && opencollective-postinstall
```

下载依赖库的 flow 类型资源，安装依赖，编译 dll。最后打印[electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate#readme)的募捐信息。

### precommit

```bash
$ lint-staged
```

在 git 提交代码时对提交的代码进行 lint 及 prettier 操作。

## 项目本体

业务逻辑集中在./app 目录下，使用 [React](https://reactjs.org/) 框架，配合 [Redux](https://redux.js.org/) 进行状态管理。使用 [react-redux](https://react-redux.js.org/) 进行两者的连接，使用 [react-router](https://www.npmjs.com/package/react-router) 进行路由管理。这是当下非常流行的一个组合。

在生产模式下，redux 使用了[connected-react-router](https://www.npmjs.com/package/connected-react-router)和[redux-thunk](https://www.npmjs.com/package/redux-thunk)两个中间件，前者用于连接 react-router，后者是 redux 官网推荐使用用来处理异步动作的工具（虽然目前尚未用到但是迟早会用）。

而在开发模式下，除了以上两个中间件之外，还加装了[redux-logger](https://www.npmjs.com/package/redux-logger)中间件用来在控制台输出动作信息。这个中间件在开发中应属标配。除此之外，对 Redux DevTools Extension 也有检测，如果发现则使用其提供的 compose 代替 redux 提供的 compose 连接中间件。代码如下：

```javascript
// If Redux DevTools Extension is installed use it, otherwise use Redux compose
/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Options: http://extension.remotedev.io/docs/API/Arguments.html
      actionCreators
    })
  : compose;
/* eslint-enable no-underscore-dangle */
```

## babel

使用 [Babel](https://babeljs.io/) 进行了语法编译，使源码能在目标浏览器上运行（即 Electron）。配置文件是./babel.config.js。

presets 使用了：

- [@babel/preset-env](https://www.npmjs.com/package/@babel/preset-env) 标配。目标设为当前使用版本的 Electron，版本号直接从 electron/package.json 读取，这样做是为了尽量利用运行环境已有的功能。
- [@babel/preset-flow](https://www.npmjs.com/package/@babel/preset-flow) 实现对 Flow 的编译。内部引入了[@babel/plugin-transform-flow-strip-types](https://www.npmjs.com/package/@babel/plugin-transform-flow-strip-types)插件把 Flow 相关的语法去掉了。
- [@babel/preset-react](https://www.npmjs.com/package/@babel/preset-react) 囊括了 react 相关的插件。

其他插件清单：

- [@babel/plugin-proposal-function-bind](https://babeljs.io/docs/en/next/babel-plugin-proposal-function-bind.html) 函数 bind 的语法糖
- [@babel/plugin-proposal-export-default-from](https://babeljs.io/docs/en/next/babel-plugin-proposal-export-default-from.html) 导入模块默认值的语法支持
- [@babel/plugin-proposal-logical-assignment-operators](https://babeljs.io/docs/en/next/babel-plugin-proposal-logical-assignment-operators.html) 逻辑赋值操作符，详情见[这里](https://github.com/tc39/proposal-logical-assignment)
- [@babel/plugin-proposal-optional-chaining](https://babeljs.io/docs/en/next/babel-plugin-proposal-optional-chaining.html) 用?.来方便的访问嵌套层级较深的对象属性
- [@babel/plugin-proposal-pipeline-operator](https://babeljs.io/docs/en/next/babel-plugin-proposal-pipeline-operator.html) 以一种优雅的、管道式的方式连续调用函数
- [@babel/plugin-proposal-nullish-coalescing-operator](https://babeljs.io/docs/en/next/babel-plugin-proposal-nullish-coalescing-operator.html) 和@babel/plugin-proposal-optional-chaining 配合使用，可以设置默认值
- [@babel/plugin-proposal-do-expressions](https://babeljs.io/docs/en/next/babel-plugin-proposal-do-expressions.html) 可以使用 do 语法进行复杂的赋值操作
- [@babel/plugin-proposal-decorators](https://babeljs.io/docs/en/next/babel-plugin-proposal-decorators.html) 可以使用类属性定义、私有属性和方法、装饰器等语法。装饰器可以用来支持框架或库的一些行为，大幅缩减代码量。
- [@babel/plugin-proposal-function-sent](https://babeljs.io/docs/en/next/babel-plugin-proposal-function-sent.html) 使用 function.sent 访问迭代器对象的 next 方法被调用时传入的参数。这样的好处是可以访问到第一次调用 next 时传入的参数。详情见[这里](https://github.com/allenwb/ESideas/blob/master/Generator%20metaproperty.md#the-proposal)
- [@babel/plugin-proposal-export-namespace-from](https://babeljs.io/docs/en/next/babel-plugin-proposal-export-namespace-from.html) export \* as someIdentifier from "someModule";的语法支持
- [@babel/plugin-proposal-numeric-separator](https://babeljs.io/docs/en/next/babel-plugin-proposal-numeric-separator.html) 支持 1_000_000_000_000 这样的数字写法，比较适合西方人
- [@babel/plugin-proposal-throw-expressions](https://babeljs.io/docs/en/next/babel-plugin-proposal-throw-expressions.html) 可以在表达式级别抛出错误
- [@babel/plugin-syntax-dynamic-import](https://babeljs.io/docs/en/next/babel-plugin-syntax-dynamic-import.html) 使用 import()语法动态引入模块
- [@babel/plugin-syntax-import-meta](https://babeljs.io/docs/en/next/babel-plugin-syntax-import-meta.html) 使用 import.meta 语法，详情见[这里](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import.meta)
- [@babel/plugin-proposal-class-properties](https://babeljs.io/docs/en/next/babel-plugin-proposal-class-properties.html) 可以使用类属性定义以及静态类属性定义
- [@babel/plugin-proposal-json-strings](https://babeljs.io/docs/en/next/babel-plugin-proposal-json-strings.html) JSON 字符串比 JS 字符串多支持两个字符，这个插件替 JS 字符串增加了这个支持，使 JSON 和 JS 字符串完全一致

开发模式独占的插件清单

- [react-hot-loader/babel](https://github.com/gaearon/react-hot-loader/blob/master/src/babel.dev.js) react-hot-loader 自带的 babel 插件，会帮你注入一些代码

生产模式独占的插件清单

- [babel-plugin-dev-expression](https://www.npmjs.com/package/babel-plugin-dev-expression) 可以像 React 一样使用\_\_DEV\_\_判断是否开发环境的小插件，生产模式下会去掉
- [@babel/plugin-transform-react-constant-elements](https://babeljs.io/docs/en/next/babel-plugin-transform-react-constant-elements.html) 尽量提升 React Element 的作用域，换句话说，尽可能使每次 render 返回同一个对象
- [@babel/plugin-transform-react-inline-elements](https://babeljs.io/docs/en/next/babel-plugin-transform-react-inline-elements.html) 配合@babel/plugin-transform-runtime 使用可以尽可能少的进行 polyfill
- [babel-plugin-transform-react-remove-prop-types](https://www.npmjs.com/package/babel-plugin-transform-react-remove-prop-types) 在生产模式下移除 prop-types 检查

以上都是 electron-react-boilerplate 预装的。

## 测试

测试相关文件在./test 里。使用了 [jest](https://jestjs.io/en/) + [enzyme](https://airbnb.io/enzyme/) + [sinon](https://sinonjs.org/) 的组合。

## lint

使用[eslint](https://eslint.org/)和[stylelint](https://www.npmjs.com/package/stylelint)。在配置文件中安装了种种规则，暂不细表。

## release

待补完
