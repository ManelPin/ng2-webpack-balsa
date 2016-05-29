# Angular 2 + Webpack for Balsa

## What is this?

The [Balsa scaffolding tool](https://github.com/gonzofish/balsa) provides a lightweight framework for scaffolding projects.
This project provides a setup for [Angular 2](https://angular.io) & [Webpack](https://webpack.github.io/) using Balsa.

## Requirements

As of now, you'll need [Node 5.0+](https://nodejs.org/en/download/releases/) & NPM to get this all working. But let me suggest
[nvm](https://github.com/creationix/nvm) or [n](https://github.com/tj/n) to manage multiple versions of Node & NPM.

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

Again, if you follow the above guidance, all commands start with `npm run balsa`.

- [Component](#component)
- [Initial](#initial)
- [Route](#route)
- [Service](#service)

All names & selectors need to be in dash format which is all lowercase with words seprated by hyphens (-).

<a name="component"></a>
### Component

#### Prompts
The component command will scaffold out a new component, including unit test file. You will be prompted with the
following options:

- `Selector: ` - this will be the selector used in a parent component to use the component. The value should be in
dash format. This value will also be used to create the exported class name. For instance, entering `my-component` will
create the class name `MyComponent`.
- `Use inline styles (y/n)?` - entering `y` or `yes` will add a line for styles. For instance, if you enter `y` and the
component selector is `my-component`, a line reading `styles: []` will be added to the TS file. Otherwise, the line will
read `styles: [require('./my-component.component.scss')]`.
- `Use inline template (y/n)?` - entering `y` or `yes` will use an empty inline template. Entering `n` or `no` will add
a line like `template: require('./my-component.component.html')` to the TS file.
- `Lifecycle hooks (comma-separated; i.e., "OnInit, OnDestroy"):` - this allows you to add lifecycle hooks to the component.
To add no hooks, just enter nothing. Valid options are as follows (and unknown values will be ignored):
    - `DoCheck` or `check`
    - `OnChanges` or `changes`
    - `OnDestroy` or `destroy`
    - `OnInit` or `init`

#### Output
This will create, at least, the following:

- `src/app/components/[selector]/[selector].component.ts`
- `src/test/components/[selector].spec.ts`

And, depending on prompt answers:

- `src/app/components/[selector]/[selector].component.scss` (if inline template is `n` or `no`)
- `src/app/components/[selector]/[selector].component.html` (if inline template is `n` or `no`)

<a name="initial"></a>
### Initial

#### Prompts
Initializes the directory to a new Git project, sets up a basic README.md & package.json. The prompts are:

- `README title` - the value entered will be the first line of README.md
- `package.json name` - this will be used for the `name` attribute in package.json
- `Repository URL:` - this will be used for the `url` attribute of the `repository` section of package.json.

#### Output
**This section does no error checking and will overwrite any existing files and create a new Git repository!** This will
create:

- `README.md`
- `package.json`
- `.git`

<a name="route"></a>
### Route

#### Prompts

If the route's component selector is not passed as an argument to the command, you will
be asked the same questions as the [component command](#component). Answer these questions
for the new route component. After that, the only question is:

- `What is the parent component?` - the selector of place to route from

#### Output
This produce the same output as the [component command](#component) for the route
component.

It will also modify the parent component to use routes. This adds

- `ROUTER_DIRECTIVES` & `ROUTER_PROVIDERS` to the `@Component` decorator
- Ensures that `Routes`, `ROUTER_DIRECTIVES`, and `ROUTER_PROVIDERS` are all imported from
`@angular/router` (run `npm i -S @angular/router` if you haven't already)
- Creates the `@Routes` decorator and adds the new route (if necessary)

<a name="service"></a>
### Service

#### Prompts
Using the dash naming method, creates a service and its unit test file. Your will be prompted with a single question:

- `Service name:` - answer this using the dash format. For instance, `my-new-service`.

#### Output
This will produce the following:

- `src/app/services/[service name].service.ts`
- `src/test/services/[service name].service.spec.ts`