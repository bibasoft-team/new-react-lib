#!/usr/bin/env node
const { program } = require('commander');
const shelljs_exec = require('shelljs.exec')
const packageJson = require('../package.json')
const fs = require('fs-extra')
const chalk = require('chalk');

const exec = (commands) => {
    return shelljs_exec(Array.isArray(commands) ? commands.join(' ') : commands, { stdio: 'inherit' })
}

const error = chalk.bold.red;
const warning = chalk.keyword('orange');


program
    .version(packageJson.version)
    .name(packageJson.name)
    .arguments('<name>')
    .description('create react library', {
        name: 'name of library',
    })
    .action(function (name) {
        const template = program.template
        if (!fs.pathExistsSync(`templates/${template}`)) {
            error(`Error: template ${name} does not exists!`)
            return
        }
        if (fs.pathExistsSync(name)) {
            error(`Error: directory ${name} already exists!`)
            return
        }
        exec(`mkdir ${name}`)
        chalk('copy template...')
        fs.copySync(`templates/${typescript}`, name)
        chalk('install dependencies...')
        // exec('npm i')
        chalk.green(`Complete!`)
        chalk.blue(`Library ${name} created successfully`)
    })
    .option('-t, --template', 'template for library', 'components')




program.parse(process.argv);

if (program.debug) console.log(program.opts());
