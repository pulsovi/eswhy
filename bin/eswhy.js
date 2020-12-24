#!/usr/bin/env node

const chalk = require('chalk');
const { program } = require('commander');
const { indent, isNull, isString, isUndefined } = require('underscore-pulsovi');

const { getCascadingProp, resolveFile } = require('../index');

const MAX_LENGTH = 100;
const purple = chalk.hex('ae81ff');

program
  .storeOptionsAsProperties(false)
  .passCommandToAction(false)
  .name('eswhy');

program
  .command('rule <rule> [file]', { isDefault: true })
  .description('(default) print cascading value for provided rule', {
    file: '(optional) get config for this file',
    rule: '(required) the eslint rule to check',
  })
  .action((rule, file) => printProp(`rules.${rule}`, file));

program
  .command('prop <prop> [file]')
  .description('print cascading value for provided prop', {
    file: '(optional) get config for this file',
    prop: '(required) the eslint prop to check',
  })
  .action(printProp);

program
  .parseAsync(process.argv)
  .catch(error => {
    console.error(chalk.red('error'), error.message);
  });

function format(object) {
  if (isNull(object)) return purple(object);
  if (isUndefined(object)) return chalk.gray(object);

  const stringified = str(object);

  if (isString(object)) return chalk.yellow(stringified);
  return chalk.green(stringified);
}

async function printProp(prop, file) {
  if (!file) console.info(chalk.green('Found file:'), chalk.yellow(await resolveFile(file)));
  const cascadingProp = await getCascadingProp(prop, file);
  return cascadingProp.forEach(([name, value]) => {
    const stringVal = indent(format(value));
    return console.info(`${name}\n${stringVal}`);
  });
}

function str(object) {
  const simple = JSON.stringify(object);
  const indented = JSON.stringify(object, null, 2);

  if (simple.length > MAX_LENGTH) return indented;
  return simple;
}
