'use strict';

const ask = require('balsa/libs/ask');

const component = require('../component');
const utils = require('../utilities');

const childComponent = require('./child-component');
const componentDecorator = require('./component-decorator');
const routerDecorator = require('./router-decorator');
const routerIncludes = require('./router-includes');

module.exports = (rootDir, selector, parentSelector) => {
    component(rootDir, selector, answers => {
        updateParent(rootDir, answers[0].answer, parentSelector);
    });
};

const updateParent = (rootDir, selector, parentSelector) => {
    if (!utils.checkIsDashFormat(parentSelector)) {
        ask(getParentComponentQuestions(), answers => {
            addRoute(rootDir, selector, answers[0].answer);
        });
    } else {
        addRoute(rootDir, selector, parentSelector);
    }
};

const getParentComponentQuestions = () => {
    return [
        { name: 'parentSelector', question: 'What is the parent component?' }
    ];
};

const addRoute = (rootDir, selector, parentSelector) => {
    const filepath = [rootDir, 'src', 'app', 'components', parentSelector, parentSelector + '.component.ts'];
    let parentFile = utils.getFileContents(filepath);

    parentFile = routerIncludes(parentFile);
    parentFile = routerDecorator(parentFile, selector, parentSelector);
    parentFile = componentDecorator(parentFile, selector);
    parentFile = childComponent(parentFile, selector);

    utils.writeFile(filepath, parentFile);
};