/**
 * Postinstall script that patches react-native-device-info's devicesWithNotch
 * and devicesWithDynamicIsland lists to include the latest devices.
 *
 * When new devices are released, add them to the ADDITIONAL_NOTCH_DEVICES
 * and/or ADDITIONAL_DYNAMIC_ISLAND_DEVICES arrays below.
 */
const fs = require('fs-extra');
const path = require('path');

const DEVICE_INFO_PATH = path.resolve(
  __dirname,
  '../node_modules/react-native-device-info',
);

// Devices missing from react-native-device-info@10.13.2 devicesWithNotch list.
// Keep this list updated when new notched devices are released.
const ADDITIONAL_NOTCH_DEVICES = [
  { brand: 'Apple', model: 'iPhone 17' },
  { brand: 'Apple', model: 'iPhone Air' },
  { brand: 'Apple', model: 'iPhone 17 Pro' },
  { brand: 'Apple', model: 'iPhone 17 Pro Max' },
  { brand: 'Apple', model: 'iPhone 16e' },
  { brand: 'Apple', model: 'iPhone 16' },
  { brand: 'Apple', model: 'iPhone 16 Plus' },
  { brand: 'Apple', model: 'iPhone 16 Pro' },
  { brand: 'Apple', model: 'iPhone 16 Pro Max' },
];

// Devices missing from react-native-device-info@10.13.2 devicesWithDynamicIsland list.
const ADDITIONAL_DYNAMIC_ISLAND_DEVICES = [
  { brand: 'Apple', model: 'iPhone 17' },
  { brand: 'Apple', model: 'iPhone Air' },
  { brand: 'Apple', model: 'iPhone 17 Pro' },
  { brand: 'Apple', model: 'iPhone 17 Pro Max' },
  { brand: 'Apple', model: 'iPhone 16' },
  { brand: 'Apple', model: 'iPhone 16 Plus' },
  { brand: 'Apple', model: 'iPhone 16 Pro' },
  { brand: 'Apple', model: 'iPhone 16 Pro Max' },
];

/**
 * Generates a formatted entry string for a single device in the array format
 * used by the compiled JS files (commonjs/module).
 */
function formatCompiledEntry(device) {
  return `{\n  brand: '${device.brand}',\n  model: '${device.model}'\n}`;
}

/**
 * Generates a formatted entry string for a single device in the TypeScript
 * source format.
 */
function formatSourceEntry(device) {
  return `  {\n    brand: '${device.brand}',\n    model: '${device.model}',\n  }`;
}

function patchCompiledFile(filePath, devices, arrayName) {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  if (devices.length > 0 && content.includes(devices[0].model)) {
    return true;
  }

  const arrayStart = `${arrayName} = [`;
  const insertIndex = content.indexOf(arrayStart);

  if (insertIndex === -1) {
    return false;
  }

  const insertPosition = insertIndex + arrayStart.length;
  const newEntries = devices.map(formatCompiledEntry).join(', ');
  const injection = `${newEntries}, `;

  content =
    content.slice(0, insertPosition) +
    injection +
    content.slice(insertPosition);

  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

function patchSourceFile(filePath, devices, arrayName) {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  if (devices.length > 0 && content.includes(devices[0].model)) {
    return true;
  }

  // Match the array declaration pattern for TS source files
  // Handles type annotations like: const devicesWithNotch: NotchDevice[] = [
  const arrayPattern = new RegExp(`(${arrayName}.*?= \\[)\\s*\\n`);
  const match = content.match(arrayPattern);

  if (!match) {
    return false;
  }

  const newEntries = devices.map(formatSourceEntry).join(',\n');
  content = content.replace(arrayPattern, `$1\n${newEntries},\n`);

  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

function patchDeviceList(devices, arrayName, fileBaseName) {
  const files = [
    {
      path: path.join(
        DEVICE_INFO_PATH,
        `lib/commonjs/internal/${fileBaseName}.js`,
      ),
      type: 'compiled',
      name: `const ${arrayName}`,
    },
    {
      path: path.join(
        DEVICE_INFO_PATH,
        `lib/module/internal/${fileBaseName}.js`,
      ),
      type: 'compiled',
      name: `const ${arrayName}`,
    },
    {
      path: path.join(DEVICE_INFO_PATH, `src/internal/${fileBaseName}.ts`),
      type: 'source',
      name: `const ${arrayName}`,
    },
  ];

  let patchedCount = 0;

  files.forEach(({ path: filePath, type, name }) => {
    const success =
      type === 'compiled'
        ? patchCompiledFile(filePath, devices, name)
        : patchSourceFile(filePath, devices, name);

    if (success) {
      patchedCount++;
    }
  });

  return patchedCount;
}

function run() {
  if (!fs.existsSync(DEVICE_INFO_PATH)) {
    // eslint-disable-next-line no-console
    console.log(
      '[@shoutem/ui] - react-native-device-info not found, skipping device list patch',
    );
    return;
  }

  const notchPatched = patchDeviceList(
    ADDITIONAL_NOTCH_DEVICES,
    'devicesWithNotch',
    'devicesWithNotch',
  );

  const dynamicIslandPatched = patchDeviceList(
    ADDITIONAL_DYNAMIC_ISLAND_DEVICES,
    'devicesWithDynamicIsland',
    'devicesWithDynamicIsland',
  );

  // eslint-disable-next-line no-console
  console.log(
    `[@shoutem/ui] - patched device lists (notch: ${notchPatched}/3, dynamic island: ${dynamicIslandPatched}/3)`,
  );
}

run();
