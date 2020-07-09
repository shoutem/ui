import { Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { IPHONE_X_HOME_INDICATOR_PADDING, NAVIGATION_HEADER_HEIGHT } from '../const';
import { Device } from './device-selector';

export function calculateKeyboardOffset(extraOffset = NAVIGATION_HEADER_HEIGHT) {
  if (Platform.OS === 'ios') {
    return (Device.isIphoneX || Device.isIphoneXR)
      ? IPHONE_X_HOME_INDICATOR_PADDING + extraOffset
      : extraOffset;
  }

  if (Platform.OS === 'android') {
    return getStatusBarHeight() + extraOffset;
  }
}

export default { calculateKeyboardOffset };
