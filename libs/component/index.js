'use strict';

const ask = require('balsa/libs/ask');
const balsa = require('balsa');
const path = require('path');

module.exports = (rootDir, selector) => {
    const files = getFiles(rootDir);

    if (!selector || selector.length === 0) {
        balsa.ask(getAllQuestions(), files);
    } else {
        askWithKnownSelector(selector, files);
    }
};

const getFiles = rootDir => {
    return getAppFiles(rootDir).concat(getTestFiles(rootDir));
};

const askWithKnownSelector = (selector, files) => {
    const additionalOptionsQuestions = getAdditionalOptionsQuestions();

    ask(additionalOptionsQuestions, answers => {
        balsa.process([
            { name: 'selector', answer: selector },
            { name: 'componentName', answer: dashToCap(selector) }
        ].concat(answers), files);
    });
}

const getAppFiles = rootDir => {
    const appDir = path.resolve(rootDir, 'src', 'app', 'components', '{{ selector }}');

    return [
        { destination: path.resolve(appDir, '{{ selector }}.component.ts'), template: getTemplate('app', rootDir) },
        { check: checkCreateTemplateFile, destination: path.resolve(appDir, '{{ selector }}.component.html') },
        { destination: path.resolve(appDir, '{{ selector }}.component.scss') }
    ]
};

const checkCreateTemplateFile = answers => {
    const templateAnswer = answers.find(answer => answer.name === 'template');

    return templateAnswer.answer !== '``';
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
    ].concat(getAdditionalOptionsQuestions());
};

const getAdditionalOptionsQuestions = () => {
    return [
        { allowBlank: true, name: 'inlineStyles', question: 'Use inline styles (y/n)?', transform: createYesNo(setInlineStyles) },
        { allowBlank: true, name: 'template', question: 'Use an inline template (y/n)?', transform: createYesNo(setTemplate) }
    ].concat(getLifecycleHookQuestions());
};

const createYesNo = method => {
    return (value, allAnswers) => {
        const isString = typeof value === 'string';
        const yesNoLookup = {
            n: false,
            y: true
        };

        if (isString && value.length > 0) {
            value = value[0].toLowerCase();
        }

        value = yesNoLookup[value];
        if (value !== undefined) {
            value = method(value, allAnswers);
        } else {
            value = null;
        }

        return value;
    };
};

const setInlineStyles = (value, allAnswers) => {
    const selector = allAnswers.find(answer => answer.name === 'selector');

    return value ? `,\n\tstyles: [require('./${ selector.answer }.component.scss')]` : '';
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