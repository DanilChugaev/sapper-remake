# rollup-ts-template

A boilerplate code for typescript projects

## Contents
  - [Prerequisites](#prerequisites)
  - [Features](#features)
  - [Run Locally](#run-locally)
  - [Build For Production](#build-for-production)
  - [Lint project](#lint-project)
  - [Run tests](#run-tests)
  - [Visualize bundle](#visualize-bundle)
  - [License](#license)

<p align="center">
  <img src="./src/images/logo.svg" alt="rollup-ts-template logo"/>
</p>

## Prerequisites

- [npm](http://npmjs.com)
- [Node.js](https://nodejs.org/en/download/)

## Features

Here's an overview of the included main tools

- **[Typescript](https://www.typescriptlang.org)** - superset of JavaScript which primarily provides optional static typing, classes and interfaces
- **[Lit](https://lit.dev)** - is a simple library for building fast, lightweight web components
- **[ESLint](https://eslint.org)** - the pluggable linting utility
- **[Stylus](https://stylus-lang.com)** - is a revolutionary new language, providing an efficient, dynamic, and expressive way to generate CSS
- **[Jest](https://jestjs.io)** - is a delightful JavaScript Testing Framework with a focus on simplicity
- **[Husky](https://typicode.github.io/husky/#/)** - modern native Git hooks made easy
- **[Browsersync](https://browsersync.io)** - for live-reload dev-server

additional plugins

- **[rollup-plugin-clear](https://www.npmjs.com/package/rollup-plugin-clear)** - for clear dist folder during build
- **[rollup-plugin-consts](https://www.npmjs.com/package/rollup-plugin-consts)** - let you use constants that are replaced at build time, such as inlining your NODE_ENV
- **[rollup-plugin-terser](https://www.npmjs.com/package/rollup-plugin-terser)** - minifies the generated package
- **[rollup-plugin-copy](https://www.npmjs.com/package/rollup-plugin-copy)** - copy files and folders, with glob support
- **[rollup-plugin-visualizer](https://www.npmjs.com/package/rollup-plugin-visualizer)** - visualize and analyze your Rollup bundle to see which modules are taking up space

## Run Locally

Clone the project

```bash
  git clone git@github.com:DanilChugaev/rollup-ts-template.git my-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the development server

```bash
  npm run dev
```

## Build For Production

To generate production build

```bash
 npm run build
```

## Lint project

To lint code in project

```bash
 npm run lint
```

## Run tests

To run unit tests

```bash
 npm run test
```

To run it in change tracking mode (--watch mode)

```bash
 npm run test-watch
```

## Visualize bundle

To visualize and analyze your Rollup bundle

```bash
 npm run stats
```

## License

[MIT](https://choosealicense.com/licenses/mit/)