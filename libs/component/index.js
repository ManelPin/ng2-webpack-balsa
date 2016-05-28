'use strict';

const ask = require('balsa/libs/ask');
const balsa = require('balsa');
const path = require('path');

const utils = require('../utilities');

module.exports = (rootDir, selector, callback) => {
    const files = getFiles(rootDir);

    if (!utils.checkIsDashFormat(selector)) {
        balsa.ask(getAllQuestions(), files, callback);
    } else {
        askWithKnownSelector(selector, files, callback);
    }
};

const getFiles = rootDir => {
    return getAppFiles(rootDir).concat(getTestFiles(rootDir));
};

const askWithKnownSelector = (selector, files, callback) => {
    const basicAnswers = [
        { name: 'selector', answer: selector },
        { name: 'componentName', answer: utils.dashToCap(selector) }
    ];
    const additionalOptionsQuestions = getAdditionalOptionsQuestions(basicAnswers);

    ask(additionalOptionsQuestions, answers => {
        balsa.process(basicAnswers.concat(answers), files);
        callback(answers);
    });
}

const getAppFiles = rootDir => {
    const appDir = path.resolve(rootDir, 'src', 'app', 'components', '{{ selector }}');

    return [
        { destination: path.resolve(appDir, '{{ selector }}.component.ts'), template: getTemplate('app', rootDir) },
        { check: checkCreateStyleFile, destination: path.resolve(appDir, '{{ selector }}.component.scss') },
        { check: checkCreateTemplateFile, destination: path.resolve(appDir, '{{ selector }}.component.html') }
    ]
};

const checkCreateStyleFile = answers => checkCreateFile('styles', answers);
const checkCreateTemplateFile = answers => checkCreateFile('template', answers);

const checkCreateFile = (fileType, answers) => {
    const createFileAnswer = answers.find(answer => answer.name === fileType);

    return createFileAnswer && createFileAnswer.answer !== '``';
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

const getAllQuestions = () => {
    return [
        { name: 'selector', question: 'Selector:', transform: utils.checkIsDashFormat },
        { name: 'componentName', useAnswer: 'selector', transform: utils.dashToCap}
    ].concat(getAdditionalOptionsQuestions());
};

const getAdditionalOptionsQuestions = (basicAnswers) => {
    return [
        { allowBlank: true, name: 'styles', question: 'Use inline styles (y/n)?', transform: utils.createYesNo(setInlineStyles, basicAnswers) },
        { allowBlank: true, name: 'template', question: 'Use an inline template (y/n)?', transform: utils.createYesNo(setTemplate, basicAnswers) }
    ].concat(getLifecycleHookQuestions(basicAnswers));
};

const setInlineStyles = (value, allAnswers) => {
    const selector = allAnswers.find(answer => answer.name === 'selector');

    return value ? `\`\`` : `require('./${ selector.answer }.component.scss')`;
};

const setTemplate = (value, allAnswers) => {
    const selector = allAnswers.find(answer => answer.name === 'selector');

    return value ? `\`\`` : `require('./${ selector.answer }.component.html')`;
};

const getLifecycleHookQuestions = () => {
    return [
        { allowBlank: true, name: 'lifecycleHooks', question: 'Lifecycle hooks (comma-separated; i.e., "OnInit, OnDestroy"):', transform: selectLifecycleHooks },
        { name: 'lifecycleImplements', useAnswer: 'lifecycleHooks', transform: setLifecycleImplements },
        { name: 'lifecycleMethods', useAnswer: 'lifecycleHooks', transform: setLifecycleMethods }
    ];
}

const selectLifecycleHooks = value => {
    const hooks = value.split(',')
                    .map(hook => checkIsValidHook(hook.trim()))
                    .filter(hook => !!hook);

    if (hooks.length > 0) {
        value = ', ' + hooks.join(', ');
    } else {
        value = '';
    }

    return value;
};

const checkIsValidHook = hook => {
    let realHook;

    switch(hook.toLowerCase()) {
        case 'changes':
        case 'onchanges':
            realHook = 'OnChanges';
            break;
        case 'check':
        case 'docheck':
            realHook = 'DoCheck';
            break;
        case 'destroy':
        case 'ondestroy':
            realHook = 'OnDestroy';
            break;
        case 'init':
        case 'oninit':
            realHook = 'OnInit';
            break;
    };

    return realHook;
};

const setLifecycleImplements = value => {
    let implementValue = '';

    if (value.length > 0) {
        implementValue = ' implements ' + value.replace(/^, /, '');
    }

    return implementValue;
};

const setLifecycleMethods = value => {
    const methodNames = value.replace(/^, /, '').split(',');
    let methods = '\n';

    if (value && methodNames.length > 0) {
        methods = methodNames.reduce((methodValue, method) => {
            return methodValue + '\tng' + method.trim() + '() {\n\t}\n';
        }, methods);
    }

    return methods;
};