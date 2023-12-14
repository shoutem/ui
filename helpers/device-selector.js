import { Dimensions, Platform, StatusBar } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import _ from 'lodash';

const { OS, isPad, isTVOS } = Platform;
const { width, height } = Dimensions.get('window');

export const IPHONE_X_HOME_INDICATOR_PADDING = 34;
export const IPHONE_X_LONG_SIDE = 812;
export const IPHONE_X_NOTCH_PADDING = 30;

export const IPHONE_XR_LONG_SIDE = 896;
export const IPHONE_XR_NOTCH_PADDING = 34;

export const IPHONE_12_LONG_SIDE = 844;
export const IPHONE_12_MAX_LONG_SIDE = 926;

export const NAVIGATION_HEADER_HEIGHT = 64;

const xDimensionsMatch =
  height === IPHONE_X_LONG_SIDE || width === IPHONE_X_LONG_SIDE;

const xrDimensionsMatch =
  height === IPHONE_XR_LONG_SIDE || width === IPHONE_XR_LONG_SIDE;

const twelveDimensionsMatch =
  height === IPHONE_12_LONG_SIDE || width === IPHONE_12_LONG_SIDE;

const twelveMaxDimensionsMatch =
  height === IPHONE_12_MAX_LONG_SIDE || width === IPHONE_12_MAX_LONG_SIDE;

const isIphoneX = OS === 'ios' && !isPad && !isTVOS && xDimensionsMatch;
// isIphoneXR also includes iPhone 12, iPhone 12 Pro, iPhone 12 Pro Max
const isIphoneXR =
  OS === 'ios' &&
  !isPad &&
  !isTVOS &&
  (xrDimensionsMatch || twelveDimensionsMatch || twelveMaxDimensionsMatch);

const isNotchedAndroid = OS === 'android' && DeviceInfo.hasNotch();

/**
 * Receives settings for different devices
 * If the device is recognized, it returns only settings for that device
 * If not, it returns settings for 'default'
 *
 * @param {object} settings The settings provided for
 * @return {settings} Returns device specific (or 'default') settings
 */

function select(settings) {
  if (settings.iPhoneX && isIphoneX) {
    return settings.iPhoneX;
  }

  if (settings.iPhoneXR && isIphoneXR) {
    return settings.iPhoneXR;
  }

  if (settings.notchedAndroid && isNotchedAndroid) {
    return settings.notchedAndroid;
  }

  return _.get(settings, 'default');
}

export const NAVIGATION_BAR_HEIGHT = select({
  iPhoneX: NAVIGATION_HEADER_HEIGHT + IPHONE_X_NOTCH_PADDING,
  iPhoneXR: NAVIGATION_HEADER_HEIGHT + IPHONE_XR_NOTCH_PADDING,
  notchedAndroid: NAVIGATION_HEADER_HEIGHT + StatusBar.currentHeight,
  default: NAVIGATION_HEADER_HEIGHT,
});

export const getHomeIndicatorPadding = () => {
  if (Platform.OS === 'android') {
    return 0;
  }

  // Apple identifier
  const deviceId = DeviceInfo.getDeviceId();

  // Extract the numbers from the deviceId string using a regular expression
  const versions = deviceId.match(/(\d+),(\d+)/);

  // Only checks if regex found X,Y, it does not resolve any of device ID-padding logic.
  // If version is present, e.g. in iPhone 9,1, it'll always return array of length 3.
  if (!versions && versions.length < 3) {
    return 0;
  }

  // Extracted numbers as strings
  const majorVersion = versions[1];
  const minorVersion = versions[2];

  const decimalNumber = parseFloat(`${majorVersion}.${minorVersion}`);

  const excludedIphones = {
    iPhone8: 10.4,
    iPhone8plus: 10.5,
    iPhoneSeGen2: 12.8,
    iPhoneSeGen3: 14.6,
  };

  // Home indicator is present since iPhone X series with id of iPhone10,3.
  // There are few newer models that do not have home indicator.
  // They're included in excludedIphones object above.
  if (
    decimalNumber >= 10.3 &&
    !Object.values(excludedIphones).includes(decimalNumber)
  ) {
    // Devices with home indicator
    return 34;
  }

  // Devices without home indicator
  return 0;
};

export const Device = {
  isIphoneX,
  isIphoneXR,
  isNotchedAndroid,
  select,
};
