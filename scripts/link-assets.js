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
  './node_modules/@shoutem/ui/fonts/rubicon-icon-font.ttf',
  './node_modules/@shoutem/ui/fonts/Rubik-Black.ttf',
  './node_modules/@shoutem/ui/fonts/Rubik-BlackItalic.ttf',
  './node_modules/@shoutem/ui/fonts/Rubik-Bold.ttf',
  './node_modules/@shoutem/ui/fonts/Rubik-BoldItalic.ttf',
  './node_modules/@shoutem/ui/fonts/Rubik-Italic.ttf',
  './node_modules/@shoutem/ui/fonts/Rubik-Light.ttf',
  './node_modules/@shoutem/ui/fonts/Rubik-LightItalic.ttf',
  './node_modules/@shoutem/ui/fonts/Rubik-Medium.ttf',
  './node_modules/@shoutem/ui/fonts/Rubik-MediumItalic.ttf',
  './node_modules/@shoutem/ui/fonts/Rubik-Regular.ttf',
];

const execArgs = [execPath, '-a', assetPaths, '-n-u'];

execSync('node', execArgs);
