const { execSync } = require('child_process');
const path = require('path');

const execPath = path.resolve(
  'node_modules',
  'react-native-asset',
  'lib',
  'cli.js',
);

// Path is the relative path seen as with root app directory being the CWD.
const assetPaths = [
  './fonts/rubicon-icon-font.ttf',
  './fonts/Rubik-Black.ttf',
  './fonts/Rubik-BlackItalic.ttf',
  './fonts/Rubik-Bold.ttf',
  './fonts/Rubik-BoldItalic.ttf',
  './fonts/Rubik-Italic.ttf',
  './fonts/Rubik-Light.ttf',
  './fonts/Rubik-LightItalic.ttf',
  './fonts/Rubik-Medium.ttf',
  './fonts/Rubik-MediumItalic.ttf',
  './fonts/Rubik-Regular.ttf',
];

const execArgs = [execPath, '-a', assetPaths, '-n-u'];

execSync('node', execArgs);
