'use strict';

const execSync = require('child_process').execSync;
const process = require('process');

// TODO (Ivan): Read native dependencies from package.json
const nativeDependencies = [
  'react-native-vector-icons',
  'react-native-share',
  'react-native-maps'
];

const linkCommands = nativeDependencies.map(dependency => `react-native link ${dependency}`);

console.log('[@shoutem/ui] - linking native dependencies');

const linkingProcess = execSync(linkCommands.join(' && '), (error, stdout, stderr) => {
  console.log(stdout);
  console.log(stderr);
  if (error !== null) {
    console.log(`Linking error: ${error}`);
    process.exit(1);
  }
  console.log('[@shoutem/ui] - native dependencies linked');
});

linkingProcess.stdout.pipe(process.stdout);
linkingProcess.stderr.pipe(process.stderr);
