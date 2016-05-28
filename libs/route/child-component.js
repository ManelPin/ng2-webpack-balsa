'use strict';

const utils = require('../utilities');

module.exports = (file, selector) => {
    const componentName = utils.dashToCap(selector);
    const importFile = `../${ selector }/${ selector }.component`;
    const componentImports = utils.getImports(file, importFile);
    let originalImports;

    if (checkHasImport(componentImports)) {
        originalImports = utils.getOriginalImports(file, importFile);
        file = file.replace(originalImports, updateImports(originalImports, componentName));
    } else if (!componentImports) {
        file = addComponentImports(file, selector, componentName);
    }

    return file;
};

const checkHasImport = componentImports => {
    return componentImports !== undefined &&
        componentImports !== null &&
        componentImports !== '*';
};

const updateImports = (imports, componentName) => {
    const importsList = imports.replace(/(\{|\})/g, '').split(',')
                            .map(imports => imports.trim())
                            .filter(imports => imports.length > 0);
    const fullComponentName = componentName + 'Component';

    if (importsList.indexOf(fullComponentName) === -1) {
        importsList.push(fullComponentName);
    }

    return '{ ' + importsList.join(', ') + ' }';
};

const addComponentImports = (file, selector, componentName) => {
    const lastImport = utils.getLastImport(file);

    return file.replace(
        lastImport,
        lastImport + '\n' +
        `import { ${componentName}Component } from '../${ selector }/${ selector }.component';`
    );
};