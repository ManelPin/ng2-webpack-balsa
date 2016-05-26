# Angular 2 + Webpack for Balsa

## What is this?

The [Balsa scaffolding tool](https://github.com/gonzofish/balsa) provides a lightweight framework for scaffolding projects.
This project provides a setup for [Angular 2](https://angular.io) & [Webpack](https://webpack.github.io/) using Balsa.

## How do I use it?

To add it to your project, just run:

```
npm i -D https://github.com/gonzofish/balsa https://github.com/gonzofish/ng2-webpack-balsa
```

And add, to your project's package.json's `scripts` section:

```
"balsa": "node ./node_modules/ng2-webpack-balsa"
```

Then you can run commands like the following:

```
npm run balsa
npm run balsa initial
npm run balsa component
npm run balsa component my-component
```