const path = require('path');

const { Legacy: { CascadingConfigArrayFactory }} = require('@eslint/eslintrc');
const { get } = require('dot-prop');

function getCascadingProp(prop, file) {
  const filename = path.resolve(file);
  const cascadingConfigArrayFactory = new CascadingConfigArrayFactory({
    eslintAllPath: require.resolve('eslint/conf/eslint-all.js'),
    eslintRecommendedPath: require.resolve('eslint/conf/eslint-recommended.js'),
  });
  const configArray = cascadingConfigArrayFactory.getConfigArrayForFile(filename);
  const finalConfig = configArray.extractConfig(filename);
  const cascadingProp = configArray.map(config => [config.name, get(config, prop)]);

  return cascadingProp.concat([['FINAL', get(finalConfig, prop)]]);
}

module.exports = {
  CascadingConfigArrayFactory,
  getCascadingProp,
};
