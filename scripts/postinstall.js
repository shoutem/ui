const { insertNativeDependencies } = require('./add-native-deps');
const { patchPackage } = require('./patch-package');

function postInstall() {
  insertNativeDependencies();
  patchPackage();
}

postInstall();
