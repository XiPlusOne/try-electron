# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- 项目采用的全部 eslint 规则在 readme 中记录备忘
- 自动发布 release
- 设法解析提取更多音轨文件的信息（封面，时长，以及其他免费文件格式等）

### Changed

- 从 flow 切换成 typeScript

## [0.3.0] - 2019-02-21

### Added

- 现在可以解码 flac 文件，提取封面

## [0.2.0] - 2019-02-17

### Added

- 增加了面向 Web 端的 webpack 配置，命令为 yarn build-web
- 增加了 yarn browse 命令，可以在浏览器中查看 build-web 命令打的包

### Removed

- 原 yarn build-analyzer 命令被移除，因为 electron 作为桌面端，对资源尺寸的要求比较宽松。分析工具现在被整合到 yarn build-web 命令中了
