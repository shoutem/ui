const { execSync } = require('child_process');
const { path } = require('path');

const execPath = path.resolve(
  'node_modules',
  'react-native-asset',
  'lib',
  'cli.js',
);
const execArgs = [execPath, '-a', ...allAssetPaths, '-n-u'];

execSync('node', execArgs);
