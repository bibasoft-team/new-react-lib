#!/usr/bin/env node
import { program } from 'commander';
import shelljs_exec from 'shelljs.exec';
import packageJson from '../package.json';
import fs from 'fs-extra';
import chalk from 'chalk';
import ciDetect from '@npmcli/ci-detect';
import path from 'path';
const inCI = ciDetect()

const rootPath = path.resolve(path.dirname(__filename), '..')

const resolveOwn = p => path.resolve(rootPath, p)

const paths = {
    templates: resolveOwn('templates')
}

const exec = (commands, opt?: any) => {
    return shelljs_exec(Array.isArray(commands) ? commands.join(' ') : commands, { stdio: 'inherit', ...opt })
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
        exec(`npm i`, { cwd: name })
        log(chalk.green(`Complete!`))
        log(chalk.blue(`Library ${name} created successfully`))
    })





program.parse(process.argv);

if (program.debug) console.log(program.opts());
