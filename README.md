使用 [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate#readme) 玩一下 [Electron](https://electronjs.org/)，姑且粗略模仿了一下网易云音乐的唱片机。

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

### build-analyzer

```bash
$ cross-env OPEN_ANALYZER=true yarn build-renderer
```

用来视图化各个包的尺寸，方便优化。

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

- react-hot-loader/patch ：根据环境变量选择导出生产或开发用版本
- webpack-dev-server/client?http://localhost:${port}/ ：在客户端初始化 webpack-dev-server 的代码，调用./socket.js 进行前后端通信，其内容我瞟了一眼，应该是使用了[sockjs-client](https://www.npmjs.com/package/sockjs-client)这个工具
- webpack/hot/only-dev-server ：在客户端监听 HMR
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

### package-all

```bash
$ yarn build && electron-builder build -mwl
```

打包

### postinstall

```bash
$ yarn flow-typed && electron-builder install-app-deps package.json && yarn build-dll && opencollective-postinstall
```

下载依赖库的 flow 类型资源，安装依赖，编译 dll。最后打印[electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate#readme)的募捐信息。

### precommit

```bash
$ lint-staged
```

## release

使用 electron-builder
