import { IPHONE_X_HOME_INDICATOR_PADDING } from '../const';
import { Device } from './device-selector';

export function calculateKeyboardOffset(extraOffset = 0) {
  return (Device.isIphoneX || Device.isIphoneXR)
    ? IPHONE_X_HOME_INDICATOR_PADDING + extraOffset
    : extraOffset;
}

export default { calculateKeyboardOffset };
