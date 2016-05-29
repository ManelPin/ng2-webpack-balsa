'use strict';

const ask = require('balsa/libs/ask');
const balsa = require('balsa');
const path = require('path');

const utils = require('../utilities');

module.exports = (rootDir, pipeName) => {
    const files = getFiles(rootDir);

    if (utils.checkIsDashFormat(pipeName)) {
       askWithKnowPipeName(pipeName, files);
    } else {
        balsa.ask(getAllQuestions(rootDir), files);
    }
};

const getFiles = rootDir => {
    const appFile = path.resolve(rootDir, 'src', 'app', 'pipes', '{{ pipeName }}.pipe.ts');
    const testFile = path.resolve(rootDir, 'src', 'test', 'specs', 'pipes', '{{ pipeName }}.pipe.spec.ts');

    return [
        { destination: appFile, template: getTemplate('app', rootDir) },
        { destination: testFile, template: getTemplate('test', rootDir) }
    ];
};

const getTemplate = (type, rootDir) => {
    return path.resolve(rootDir, 'node_modules', 'ng2-webpack-balsa', 'libs', 'pipe', 'templates', type + '.ts');
};

const askWithKnowPipeName = (pipeName, files) => {
    const className = utils.dashToCap(pipeName);
    const pipeNameAnswer = [
        { answer: pipeName, name: 'pipeName' },
        { answer: className, name: 'pipeClassName' },
        { answer: camelizeClassName(className), name: 'pipeCamelName' }
    ];

    ask(getSupportingQuestions(), answers => {
        balsa.process(pipeNameAnswer.concat(answers), files);
    });
}

const getAllQuestions = () => {
    return [
        { name: 'pipeName', question: 'Pipe name (in dash-case):', transform: utils.checkIsDashFormat },
        { name: 'pipeClassName', useAnswer: 'pipeName', transform: utils.dashToCap },
        { name: 'pipeCamelName', useAnswer: 'pipeClassName', transform: camelizeClassName }
    ].concat(getSupportingQuestions());
};

const camelizeClassName = className => className[0].toLowerCase() + className.slice(1);

const getSupportingQuestions = () => {
    return [
        { allowBlank: true, name: 'inputTypeAll', question: 'Input type (type:fileLocation, blank is `any`):', transform: deriveType },
        { name: 'inputType', transform: inputTypeAll => inputTypeAll[0], useAnswer: 'inputTypeAll' },
        { allowBlank: true, name: 'outputTypeAll', question: 'Output type(type:fileLocation, blank is `any`):', transform: deriveType },
        { name: 'outputType', transform: outputTypeAll => outputTypeAll[0], useAnswer: 'outputTypeAll' },
        { allowBlank: true, name: 'additionalArgumentsAll', question: 'Additional arguments (argument:type:fileLocation, comma-separated):' },
        { name: 'additionalArguments', transform: formatAdditionalArguments, useAnswer: 'additionalArgumentsAll' },
        { name: 'typeImports', transform: createTypeImports, useAnswer: 'inputTypeAll' }
    ];
};

const deriveType = value => {
    let derivedType = null;
    let location;
    let type;

    if (typeof value === 'string') {
        derivedType = value.split(':').map(subValue => subValue.trim());

        if (derivedType[0] === '') {
            derivedType = ['any'];
        }
    }

    return derivedType;
};

const formatAdditionalArguments = (value) => {
    const additional = value.split(',').map(arg => {
        const argSplit = arg.split(':').map(argVal => argVal.trim());
        let realArg = '';

        if (argSplit[0] !== '') {
            if (argSplit.length < 2) {
                argSplit[1] = 'any';
            }

            realArg = argSplit[0] + ': ' + argSplit[1];
        }

        return realArg;
    });
    let additionalString  = additional.filter(arg => arg !== '').join(', ');

    if (additionalString.length > 0) {
        additionalString = ', ' + additionalString;
    }

    return additionalString;
};

const createTypeImports = (inputTypeAll, answers) => {
    const outputTypeAll = answers.find(answer => answer.name === 'outputTypeAll' ).answer;
    const additionalArgumentsAll = answers.find(answer => answer.name === 'additionalArgumentsAll').answer;
    let importStatements = '';

    if (inputTypeAll[0] !== 'any') {
        importStatements = createTypeImport(inputTypeAll);
    }

    if (outputTypeAll[0] !== 'any') {
        importStatements = createTypeImport(outputTypeAll, importStatements)
    }

    additionalArgumentsAll.split(',').forEach(arg => {
        const argSplit = arg.split(':').map(splitArg => splitArg.trim());

        if (argSplit[1] && argSplit[2]) {
            importStatements = createTypeImport([argSplit[1], argSplit[2]], importStatements);
        }
    });

    if (importStatements) {
        importStatements = '\n' + importStatements;
    }

    return importStatements;
};

const createTypeImport = (type, existingImport) => {
    const location = getRelativeLocation(type[1]);
    let typeImport;

    if (existingImport) {
        typeImport = updateExistingImport(type, location, existingImport);
    } else {
        typeImport = `\nimport { ${ type[0] } } from '${location}'`
    }

    return typeImport;
};

const getRelativeLocation = fullLocation => {
    // if the path doesn't start with "pipes" or ".." prepend '../' to it
    const splitLocation = fullLocation.split('/');

    if (splitLocation[0] !== 'pipes' && splitLocation[0] !== '..') {
        splitLocation.unshift('..');
    }

    return splitLocation.join('/');
};

const updateExistingImport = (type, location, existingImport) => {
    let imported = utils.getImports(existingImport, location);

    if (imported) {
        imported = imported.split(',').map(anImport => anImport.trim());
    } else {
        imported = [];
    }

    if (imported.indexOf(type) === -1) {
        existingImport = addTypeToExistingImport(type, location, imported, existingImport);
    } else {
        existingImport = existingImport + createTypeImport(type);
    }

    return existingImport;
};

const addTypeToExistingImport = (type, location, imported, existingImport) => {
    const importRegexes = utils.getImportRegexes(location);
    const importStatement = existingImport.match(importRegexes.specified);

    if (importStatement) {
        existingImport = existingImport.replace(importStatement[0], createTypeImport([imported.concat(type[0]).join(','), location]));
    } else {
        existingImport = existingImport + createTypeImport(type);
    }

    return existingImport;
};