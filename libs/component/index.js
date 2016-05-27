'use strict';

const ask = require('balsa/libs/ask');
const balsa = require('balsa');
const path = require('path');

module.exports = (rootDir, selector) => {
    const files = getFiles(rootDir);

    if (!selector || selector.length === 0) {
        balsa.ask(getQuestions(), files);
    } else {
        askWithKnownSelector(selector, files);
    }
};

const getFiles = rootDir => {
    return getAppFiles(rootDir).concat(getTestFiles(rootDir));
};

const askWithKnownSelector = (selector, files) => {
    const lifecycleHookQuestions = getLifecycleHookQuestions();

    ask(lifecycleHookQuestions, answers => {
        balsa.process([
            { name: 'selector', answer: selector },
            { name: 'componentName', answer: dashToCap(selector) },
            { name: 'lifecycleHooks', answer: answers[0].answer },
            { name: 'lifecycleImplements', answer: answers[1].answer },
            { name: 'lifecycleMethods', answer: answers[2].answer }
        ], files);
    });
}

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

const getAllQuestions = () => {
    return [
        { name: 'selector', question: 'Selector:' },
        { name: 'componentName', useAnswer: 'selector', transform: dashToCap}
    ].concat(getLifecycleHookQuestions());
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

const dashToCap = value => {
    return value[0].toUpperCase() + value.slice(1).replace(/(\-.)/g, match => match.replace('-', '').toUpperCase());
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