'use strict';

const ask = require('balsa/libs/ask');
const path = require('path');

const main = (cliArgs)  => {
    const rootDir = process.cwd();
    const command = getCommand(cliArgs[0], rootDir);
    const commandArguments = cliArgs.slice(1);

    if (typeof command === 'function') {
        commandArguments.unshift(rootDir);
        command.apply(null, commandArguments);
    } else {
        askForType();
    }
};

const getCommand = (command, rootDir) => {
    const formattedCommand = command ? command.replace(/^\-/g, '') : command;
    const libsDir = path.resolve(rootDir, 'node_modules', 'ng2-webpack-balsa', 'libs');
    let commandFunction;
    let commandName;

    switch (formattedCommand) {
        case 'component':
        case 'c':
            commandFunction = require(path.resolve(libsDir, 'component'));
            break;
        case 'initial':
        case 'i':
            commandName = 'initial';
            break;
        case 'pipe':
        case 'p':
            commandName = 'pipe';
            break;
        case 'route':
        case 'r':
            commandName = 'route'
            break;
        case 'service':
        case 's':
            commandName = 'service';
            break;
    }

    if (commandName) {
        commandFunction = require(path.resolve(libsDir, commandName));
    }

    return commandFunction;
};

const askForType = () => {
    ask([{ name: 'type', question: 'What would you like to scaffold?'}], answers => {
        main(answers[0].answer.split(/\s+/))
    });
};

if (!module.parent) {
    main(process.argv.slice(2));
}

module.exports = main;