使用 electron-react-boilerplate 玩一下 Electron，界面姑且粗略模仿了一下网易云音乐的唱片机。

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

electron-react-boilerplate 自带大量命令，我也加了少量，这里给出详细说明以备忘。

### build

```bash
$ concurrently "yarn build-main" "yarn build-renderer"
```

- [concurrently](https://www.npmjs.com/package/concurrently) 用于优化并发执行体验的工具

同时运行 yarn build-main 以及 yarn build-renderer

electron 有一条主进程用来运行窗口，每个 Tab 页占用一条渲染进程。[相关阅读](https://electronjs.org/docs/tutorial/application-architecture)

### build-main

```bash
$ cross-env NODE_ENV=production webpack --config ./configs/webpack.config.main.prod.babel.js --colors
```

- [cross-env](https://www.npmjs.com/package/cross-env) 用于设置环境变量的工具
- [webpack](https://webpack.js.org/) 众所周知的打包工具，功能繁多

entry 是 ./app/main.dev ，output 是./app/main.prod.js，用来跑 electron 的主进程。./app/main.prod.js 也是应用入口。在这个文件里，同目录的 app.html 文件会被渲染。

### build-renderer

```bash
$ cross-env NODE_ENV=production webpack --config ./configs/webpack.config.renderer.prod.babel.js --colors
```

- [cross-env](https://www.npmjs.com/package/cross-env)
- [webpack](https://webpack.js.org/)

entry 是 ./app/index.js output 是 ./app/dist/renderer.prod.js。刚才在主进程中渲染的 app.html 会去请求此文件。这一步已经隔离了 electron 这个环境，之后都是纯 web 开发。

### build-analyzer

```bash
$ cross-env OPEN_ANALYZER=true yarn build-renderer
```

- [cross-env](https://www.npmjs.com/package/cross-env)
- [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) 将输出的各个包的尺寸视图化

用来视图化各个包的尺寸，方便优化。

### dev

```bash
$ cross-env START_HOT=1 node -r @babel/register ./internals/scripts/CheckPortInUse.js && cross-env START_HOT=1 yarn start-renderer-dev
```

- [cross-env](https://www.npmjs.com/package/cross-env)
- [node](https://nodejs.org/en/) 众所周知的 JS 运行环境
- [@babel/register](https://babeljs.io/docs/en/next/babel-register.html) 挂在 node 的 require 方法上，自动解析语法
- [chalk](https://www.npmjs.com/package/chalk) 使终端显示的文本更漂亮的工具
- [detectPort](https://www.npmjs.com/package/detect-port) 端口占用检测工具

其中./internals/scripts/CheckPortInUse.js 是检查端口占用的，因为使用了 import 等 node 不支持的语法，所以必须预载入@babel/register 才能跑。

### start-renderer-dev

```bash
$ cross-env NODE_ENV=development webpack-dev-server --config configs/webpack.config.renderer.dev.babel.js
```

- [webpack-dev-server](https://www.npmjs.com/package/webpack-dev-server) webpack 提供的开发辅助工具

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

- [cross-env](https://www.npmjs.com/package/cross-env)
- [webpack](https://webpack.js.org/)

一次性生成所有依赖。entry 是 package.json 里的 dependencies 下的所有模块，output 是./dll/renderer.dev.dll.js。处于开发模式时，./app/app.html 会去请求这个文件。同时还会生成一个 render.json 的清单文件供以后使用。

### start-main-dev

```bash
$ cross-env HOT=1 NODE_ENV=development electron -r @babel/register ./app/main.dev.js
```

- [cross-env](https://www.npmjs.com/package/cross-env)
- [electron](https://electronjs.org/)
- [@babel/register](https://babeljs.io/docs/en/next/babel-register.html)

跑一个 electron 主进程，前面提到过，因为使用了 import 语法，所以要预载入@babel/register。

## 依赖清单

一言以蔽之，该项目就是使用 electron-react-boilerplate 开发的一个非常简单的应用。制作目的仅仅是为了尝试一下 electron。下面是一份涉及的开发及运行时依赖的清单以及简单说明，附上这份说明的目的是备忘。
