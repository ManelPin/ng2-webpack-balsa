'use strict';

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const ask = require('balsa/libs/ask');
const balsa = require('balsa');

module.exports = rootDir => {
    ask(getQuestions(), answers => {
        balsa.process(answers, getFiles(rootDir), true);
        initGit(rootDir);
    });
};

const getQuestions = () => {
    return [
        { name: 'readmeTitle', question: 'README title:' },
        { name: 'repoName', question: 'package.json name:' },
        { name: 'repoUrl', question: 'Repository URL:' },
        { name: 'version', useAnswer: 'repoUrl', transform: () => '0.0.0' }
    ];
};

const getFiles = rootDir => {
    return [
        { destination: path.resolve(rootDir, 'package.json'), template: getTemplate('package.json', rootDir) },
        { destination: path.resolve(rootDir, 'README.md'), template: getTemplate('README.md', rootDir) }
    ]
};

const getTemplate = (filename, rootDir) => {
    return path.resolve(rootDir, 'node_modules', 'ng2-webpack-balsa', 'libs', 'initial', 'templates', filename);
};

const initGit = rootDir => {
    deleteFolder(path.resolve(rootDir, '.git'));
    createGitProject(rootDir);
};

const deleteFolder = folder => {
    if (fs.existsSync(folder)) {
        fs.readdirSync(folder).forEach(file => {
            const filePath = path.resolve(folder, file);

            if (fs.lstatSync(filePath).isDirectory()) {
                deleteFolder(filePath);
            } else {
                fs.unlinkSync(filePath);
            }
        });

        fs.rmdirSync(folder);
    }
};

const createGitProject = rootDir => {
    const startingDir = __dirname;

    process.chdir(rootDir);
    childProcess.execSync('git init');
    process.chdir(startingDir);
};