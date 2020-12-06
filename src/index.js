#!/usr/bin/env node
const { program } = require('commander');
const packageJson = require('../package.json')

program
    .version(packageJson.version)
    .name(packageJson.name)
    .arguments('<name>')
    .description('create react library', {
        name: 'name of library',
    })
    .action(function (name) {
        console.log('command:', name);
    })
    .option('-t, --template', 'template for library', 'typescript')




program.parse(process.argv);

if (program.debug) console.log(program.opts());
