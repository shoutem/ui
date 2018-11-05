import { Platform, Dimensions } from 'react-native';
import _ from 'lodash';

import { IPHONE_X_LONG_SIDE } from '../const';

const { OS, isPad, isTVOS } = Platform;
const { width, height } = Dimensions.get('window');

const dimensionsMatch = (
  (height === IPHONE_X_LONG_SIDE) || (width === IPHONE_X_LONG_SIDE)
);

const isIphoneX = (OS === 'ios' && !isPad && !isTVOS && dimensionsMatch);

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

  return _.get(settings, 'default');
}

export const Device = {
  isIphoneX,
  select,
}
