'use strict';

const utils = require('../utilities');

module.exports = file => {
    const routerImports = getRouterImports(file);
    const neededImports = '{ Routes, ROUTER_DIRECTIVES, ROUTER_PROVIDERS }';

    if (routerImports && routerImports !== '*') {
        file = file.replace(getOriginalImports(file), neededImports);
    } else if (!routerImports) {
        file = addRouterImports(file, neededImports);
    }

    return file;
};

const getRouterImports = file => {
    const importRegex = utils.getImportRegexes('@angular/router');
    let imports;
    let matches;

    if (matches = file.match(importRegex.specified)) {
        imports = utils.getImported(matches[0]);
    } else if (matches = file.match(importRegex.all)) {
        imports = '*';
    }

    return imports;
};

const getOriginalImports = file => {
    const importRegex = utils.getImportRegexes('@angular/router');
    const originalImport = file.match(importRegex.specified)[0];

    return originalImport.match(importRegex.curlies)[0];
};

const addRouterImports = (file, neededImports) => {
    const lastImport = utils.getLastImport(file);

    return file.replace(lastImport, lastImport + '\n' + 'import ' + neededImports + ' from \'@angular/router\';');
};