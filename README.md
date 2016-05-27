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

## Commands

Again, if you follow the above guidance, all commands start with `npm run balsa `

### Component

The component command will scaffold out a new component, including unit test file. You will be prompted with the
following options:

- `Selector: ` - this will be the selector used in a parent component to use the component. This value will also be
used to create the exported class name. For instance, entering `my-component` will create the class name `MyComponent`
- `Use inline styles (y/n)?` - entering `y` or `yes` will add a line for styles. For instance, if you enter `y` and the
component selector is `my-component`, a line reading `styles: [require('./my-component.component.scss')]` will be added
to the TS file.
- `Use inline template (y/n)?` - entering `y` or `yes` will use an empty inline template. Entering `n` or `no` will add
a line like `template: require('./my-component.component.html')` to the TS file.
- `Lifecycle hooks (comma-separated; i.e., "OnInit, OnDestroy"):` - this allows you to add lifecycle hooks to the component.
To add no hooks, just enter nothing. Valid options are as follows (and unknown values will be ignored):
    - `DoCheck` or `check`
    - `OnChanges` or `changes`
    - `OnDestroy` or `destroy`
    - `OnInit` or `init`

### Initial

Initializes the directory to a new Git project, sets up a basic README.md & package.json. The prompts are:

- `README title` - the value entered will be the first line of README.md
- `package.json name` - this will be used for the `name` attribute in package.json
- `Repository URL:` - this will be used for the `url` attribute of the `repository` section of package.json.

**This section does no error checking and will overwrite any existing files and create a new Git repository!**