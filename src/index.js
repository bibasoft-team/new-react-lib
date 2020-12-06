#!/usr/bin/env node
const { program } = require('commander');
const shelljs_exec = require('shelljs.exec')
const packageJson = require('../package.json')
const fs = require('fs-extra')
const chalk = require('chalk');
const ciDetect = require('@npmcli/ci-detect')
const path = require('path')
const inCI = ciDetect()

const rootPath = path.resolve(path.dirname(__filename), '..')

const resolveOwn = p => path.resolve(rootPath, p)

const paths = {
    templates: resolveOwn('templates')
}

const exec = (commands) => {
    return shelljs_exec(Array.isArray(commands) ? commands.join(' ') : commands, { stdio: 'inherit' })
}

const log = console.log
const error = (text) => {
    console.error(chalk.bold.red(text));
    if (inCI) {
        throw new Error(text)
    }
}
// const warning = chalk.keyword('orange');


program
    .version(packageJson.version)
    .name(packageJson.name)
    .option('-t, --template', 'template for library', 'components')
    .option('-f, --force', 'force delete existing folder')
    .arguments('<name>')
    .description('create react library', {
        name: 'name of library',
    })
    .action(function (name) {
        const template = program.template || 'components'
        const force = program.force || false
        if (!fs.pathExistsSync(`${paths.templates}/${template}`)) {
            error(`Error: template ${template} does not exists!`)
            return
        }
        if (fs.pathExistsSync(name)) {
            if (force) {
                fs.removeSync(name)
            } else {
                error(`Error: directory ${name} already exists!`)
                return
            }
        }
        exec(`mkdir ${name}`)

        log(chalk('copy template...'))
        let ignore = []
        if (fs.existsSync(`${paths.templates}/${template}/.gitignore`)) {
            ignore = fs.readFileSync(`${paths.templates}/${template}/.gitignore`)
                .toString()
                .split('\n')
                .map(s => s.replace(/\#.*$/gm, ''))
                .filter(s => /\S/gm.test(s))
        }
        fs.copySync(`${paths.templates}/${template}`, `${name}`, {
            filter: (f) => !ignore.some(i => new RegExp(i).test(f))
        })

        log(chalk('install dependencies...'))
        exec('npm i')
        log(chalk.green(`Complete!`))
        log(chalk.blue(`Library ${name} created successfully`))
    })





program.parse(process.argv);

if (program.debug) console.log(program.opts());
