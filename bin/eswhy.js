#!/usr/bin/env node

const chalk = require('chalk');
const { program } = require('commander');
const { indent, isNull, isString, isUndefined } = require('underscore-pulsovi');

const { getCascadingProp } = require('../index');

const MAX_LENGTH = 100;
const purple = chalk.hex('ae81ff');

program
  .storeOptionsAsProperties(false)
  .passCommandToAction(false)
  .name('eswhy');

program
  .command('rule <rule> <file>')
  .description('print cascading value for provided rule')
  .action((rule, file) => printProp(`rules.${rule}`, file));

program
  .command('prop <prop> <file>')
  .description('print cascading value for provided prop')
  .action(printProp);

program
  .parse(process.argv);

function format(object) {
  if (isNull(object)) return purple(object);
  if (isUndefined(object)) return chalk.gray(object);

  const stringified = str(object);

  if (isString(object)) return chalk.yellow(stringified);
  return chalk.green(stringified);
}

function printProp(prop, file) {
  const cascadingProp = getCascadingProp(prop, file);
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
