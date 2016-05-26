'use strict';

const balsa = require('balsa');
const path = require('path');

module.exports = (rootDir, componentName) => {
    const files = getFiles(rootDir);

    if (!componentName || componentName.length === 0) {
        balsa.ask(getQuestions(), files);
    } else {
        balsa.process([
            { name: 'selector', answer: componentName },
            { name: 'componentName', answer: dashToCap(componentName) }
        ], files);
    }
};

const getFiles = rootDir => {
    return getAppFiles(rootDir).concat(getTestFiles(rootDir));
};

const getAppFiles = rootDir => {
    const appDir = path.resolve(rootDir, 'src', 'app', 'components', '{{ selector }}');

    return [
        { destination: path.resolve(appDir, '{{ selector }}.component.ts'), template: getTemplate('app', rootDir) },
        { destination: path.resolve(appDir, '{{ selector }}.component.html') },
        { destination: path.resolve(appDir, '{{ selector }}.component.scss') }
    ]
};

const getTestFiles = rootDir => {
    return [
        {
            destination: path.resolve(rootDir, 'src', 'test', 'specs', 'components', '{{ selector }}.component.spec.ts'),
            template: getTemplate('test', rootDir)
        }
    ];
};

const getTemplate = (type, rootDir) => {
    return path.resolve(rootDir, 'node_modules', 'ng2-webpack-balsa', 'libs', 'component', 'templates', type + '.ts');
};

const getQuestions = () => {
    return [
        { name: 'selector', question: 'Selector:' },
        { name: 'componentName', useAnswer: 'selector', transform: dashToCap}
    ];
};

const dashToCap = value => {
    return value[0].toUpperCase() + value.slice(1).replace(/(\-.)/g, match => match.replace('-', '').toUpperCase());
};