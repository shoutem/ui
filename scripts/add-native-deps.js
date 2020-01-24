const fs = require('fs-extra');
const { nativeDependencies } = require('../const');

const ROOT_PACKAGE_JSON_PATH = './package.json';
const UI_PACKAGE_JSON_PATH = './node_modules/@shoutem/ui/package.json';

function insertNativeDependencies() {
  const rootPackageJson = fs.readJsonSync(ROOT_PACKAGE_JSON_PATH);
  const uiPackageJson = fs.readJsonSync(UI_PACKAGE_JSON_PATH);

  const uiNativeDependencies = uiPackageJson.nativeDependencies;
  const uiDependencies = uiPackageJson.dependencies;
  const nativeDeps = uiNativeDependencies.reduce(
    (o, dep) => ({ ...o, [dep]: uiDependencies[dep]}), {}
  );

  const newPackageJson = {
    ...rootPackageJson,
    dependencies: {
      ...rootPackageJson.dependencies,
      ...nativeDeps,
    }
  };

  fs.writeJsonSync(ROOT_PACKAGE_JSON_PATH, newPackageJson, { spaces: 2 });
  console.log('[@shoutem/ui] - native dependencies added to root package.json');
}

console.log('[@shoutem/ui] - adding native dependencies to root package.json');

insertNativeDependencies();
