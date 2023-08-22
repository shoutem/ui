const { execSync } = require('child_process');
const path = require('path');

const execPath = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'react-native-asset',
  'lib',
  'cli.js',
);

const rootAppPath = path.resolve(
  __dirname, // app/node_modules/@shoutem/ui/scripts
  '..', // app/node_modules/@shoutem/ui
  '..', // app/node_modules/@shoutem
  '..', // app/node_modules
  '..', // app
);

const assetPaths = [
  path.resolve(__dirname, '../fonts/rubicon-icon-font.ttf'),
  path.resolve(__dirname, '../fonts/Rubik-Black.ttf'),
  path.resolve(__dirname, '../fonts/Rubik-BlackItalic.ttf'),
  path.resolve(__dirname, '../fonts/Rubik-Bold.ttf'),
  path.resolve(__dirname, '../fonts/Rubik-BoldItalic.ttf'),
  path.resolve(__dirname, '../fonts/Rubik-Italic.ttf'),
  path.resolve(__dirname, '../fonts/Rubik-Light.ttf'),
  path.resolve(__dirname, '../fonts/Rubik-LightItalic.ttf'),
  path.resolve(__dirname, '../fonts/Rubik-Medium.ttf'),
  path.resolve(__dirname, '../fonts/Rubik-MediumItalic.ttf'),
  path.resolve(__dirname, '../fonts/Rubik-Regular.ttf'),
];

const execArgs = ['node', execPath, '-a', ...assetPaths, '-p', rootAppPath];

execSync(execArgs.join(' '), { cwd: __dirname });
