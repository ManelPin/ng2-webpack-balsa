'use strict';

const balsa = require('balsa');
const path = require('path');

const utils = require('../utilities');

module.exports = (rootDir, name) => {
    const files = getFiles(rootDir);

    if (!name || name.trim().length === 0) {
        balsa.ask(getAllQuestions(), files);
    } else {
        balsa.process([
            { name: 'filename', answer: name },
            { name: 'serviceName', answer: utils.dashToCap(name) }
        ], files);
    }
};

const getFiles = rootDir => {
    return [
        { destination: path.resolve(rootDir, 'src', 'app', 'services', '{{ filename }}.service.ts'), template: getTemplate('app', rootDir) },
        { destination: path.resolve(rootDir, 'src', 'test', 'specs', 'services', '{{ filename }}.service.spec.ts'), template: getTemplate('test', rootDir) }
    ];
};

const getTemplate = (type, rootDir) => {
    return path.resolve(rootDir, 'node_modules', 'ng2-webpack-balsa', 'libs', 'service', 'templates', type + '.ts');
};

const getAllQuestions = () => {
    return [
        { name: 'filename', question: 'Service name:', transform: utils.checkIsDashFormat },
        { name: 'serviceName', transform: utils.dashToCap, useAnswer: 'filename' }
    ];
};