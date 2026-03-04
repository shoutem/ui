const path = require('path');
const { execSync } = require('child_process');

function patchPackage() {
  // eslint-disable-next-line no-console
  console.log('[@shoutem/ui] - applying package patches');

  try {
    execSync('node node_modules/patch-package --patch-dir patches', {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'inherit',
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(
      `[@shoutem/ui] - error applying patches\n${e.message}`,
    );
  }
}

module.exports = { patchPackage };
