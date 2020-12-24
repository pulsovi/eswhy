const path = require('path');

const { Legacy: { CascadingConfigArrayFactory }} = require('@eslint/eslintrc');
const { get } = require('dot-prop');
const pkgDir = require('pkg-dir');
const { isString } = require('underscore');

async function getCascadingProp(prop, file) {
  const filename = await resolveFile(file);
  const cascadingConfigArrayFactory = new CascadingConfigArrayFactory({
    eslintAllPath: require.resolve('eslint/conf/eslint-all.js'),
    eslintRecommendedPath: require.resolve('eslint/conf/eslint-recommended.js'),
  });
  const configArray = cascadingConfigArrayFactory.getConfigArrayForFile(filename);
  const finalConfig = configArray.extractConfig(filename);
  const cascadingProp = configArray.map(config => [config.name, get(config, prop)]);

  return cascadingProp.concat([['FINAL', get(finalConfig, prop)]]);
}

async function getMain() {
  return require.resolve(await pkgDir());
}

function resolveFile(file) {
  if (isString(file))
    return path.resolve(file);
  return getMain();
}

module.exports = {
  CascadingConfigArrayFactory,
  getCascadingProp,
  resolveFile,
};
