'use strict';

const fs = require('fs');
const path = require('path');

exports.checkIsDashFormat = value => {
    return !!value &&
        typeof value === 'string' &&
        value.length > 0 &&
        !!value.match(/^[a-z][a-z0-9]*(\-[a-z0-9]*)*$/) &&
        value;
};

exports.createYesNo = (method, basicAnswers) => {
    return (value, allAnswers) => {
        const isString = typeof value === 'string';
        const yesNoLookup = {
            n: false,
            y: true
        };

        if (isString && value.length > 0) {
            value = value.trim()[0].toLowerCase();
        }

        value = yesNoLookup[value];
        if (value !== undefined) {
            value = method(value, allAnswers.concat(basicAnswers));
        } else {
            value = null;
        }

        return value;
    };
};

exports.dashToCap = value => {
    return value[0].toUpperCase() + value.slice(1).replace(/(\-.)/g, match => match.replace('-', '').toUpperCase());
};

exports.getFileContents = filenameParts => {
    const filepath = path.resolve.apply(null, filenameParts);

    return fs.readFileSync(filepath, 'utf8');
};

exports.getImported = imports => {
    const importRegex = exports.getImportRegexes();

    return imports.match(importRegex.curlies)[0].replace(/(\{|\})/g, '').trim();
};

exports.getImportRegexes = (from) => {
    return {
        all: new RegExp(`\\s*import\\s+\\*\\s+as\\s+(?!from).+\\s+from\\s+('${ from }'|"${ from }");?`),
        any: /\s*import([^'"])+('|")[^'"]+('|");?/g,
        curlies: /\{(?!\}).+\}/,
        specified: new RegExp(`\\s*import\\s+\\{(?!\\}).*\\}\\s+from\\s+('${ from }'|"${ from }");?`)
    };
};

exports.getImports = (file, importFile) => {
    const importRegex = exports.getImportRegexes(importFile);
    let imports;

    if (imports = file.match(importRegex.specified)) {
        imports = exports.getImported(imports[0]);
    } else if (file.match(importRegex.all)) {
        imports = '*'
    }

    return imports;
};

exports.getLastImport = file => {
    const importRegex = exports.getImportRegexes();
    const allImports = file.match(importRegex.any);

    return allImports.slice(-1)[0];
};

exports.getOriginalImports = (file, importFile) => {
    const importRegex = exports.getImportRegexes(importFile);
    const originalImport = file.match(importRegex.specified)[0];

    return originalImport.match(importRegex.curlies)[0];
};

exports.writeFile = (filenameParts, data) => {
    const filepath = path.resolve.apply(null, filenameParts);

    fs.writeFileSync(filepath, data, { encoding: 'utf8' });
};