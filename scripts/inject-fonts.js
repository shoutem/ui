const fs = require('fs-extra');
const glob = require('glob');
const _ = require('lodash');
// const path = require('path');
const xcode = require('xcode');
// const buildTools = require('shoutem.application/build');
// const { getExtensionSettings } = buildTools.configuration;
// const {
//   projectPath,
//   files: { downloadFile },
// } = require('@shoutem/build-tools');

// function resolveAssetFilePath(chimeFileName) {
//   const assetsSoundDir = path.resolve(projectPath, 'assets/sound');

//   if (!fs.existsSync(assetsSoundDir)) {
//     fs.mkdirSync(assetsSoundDir);
//   }

//   return path.resolve(assetsSoundDir, chimeFileName);
// }

// function resolveAndroidPath(chimeFileName) {
//   const androidFileDir = path.resolve(
//     projectPath,
//     'android/app/src/main/res/raw',
//   );

//   if (!fs.existsSync(androidFileDir)) {
//     fs.mkdirSync(androidFileDir);
//   }

//   return path.resolve(androidFileDir, chimeFileName);
// }

// function androidInjectChimeSound(filePath, chimeFileName) {
//   const androidFilePath = resolveAndroidPath(chimeFileName);

//   fs.copyFile(filePath, androidFilePath, err => {
//     if (err) {
//       console.error(
//         'Failed copying chime file to Android resources folder',
//         err,
//       );
//       process.exit(1);
//     }
//   });

//   console.log(`Android: Added ${chimeFileName} to Android resources`);
// }

function iosInjectFonts() {
  const xcodeprojPath = glob.sync(
    `../../../../ios/*.xcodeproj/project.pbxproj`,
  );

  if (_.isEmpty(xcodeprojPath)) {
    console.error(
      'Are you sure you are in a React Native project directory? Xcode project file could not be found.',
    );
    process.exit(1);
  }

  const xcodeProject = xcode.project(xcodeprojPath).parseSync();
  const projectUuid = xcodeProject.getFirstTarget().uuid;

  const fonts = fs.readdirSync('./fonts');

  fonts.forEach(fontName => {
    xcodeProject.addResourceFile(`./fonts/${fontName}`, {
      target: projectUuid,
    });
    fs.writeFileSync(xcodeprojPath, xcodeProject.writeSync());

    console.log(`iOS: Added font ${fontName} to ${xcodeprojPath} resources`);
  });
}

function injectFonts() {
  iosInjectFonts();
}

module.exports = injectFonts;
