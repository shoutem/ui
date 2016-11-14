'use strict';

const exec = require('child_process').exec;

// TODO (Ivan): Read native dependencies from package.json
const nativeDependencies = [
  'react-native-vector-icons',
  'react-native-share',
  'react-native-maps'
];

const linkCommands = nativeDependencies.map(dependency => `react-native link ${dependency}`);

console.log('[@shoutem/ui] - linking native dependencies');

exec(linkCommands.join(' && '), function(error, stdout, stderr) {
  console.log(stdout);
  console.log(stderr);
  if (error !== null) {
    console.log('Linking error: ' + error);
  }
  console.log('[@shoutem/ui] - native dependencies linked');
});
