'use strict';

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