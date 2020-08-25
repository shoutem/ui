import { Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { NAVIGATION_BAR_HEIGHT } from '../theme';

export function calculateKeyboardOffset(extraOffset = NAVIGATION_BAR_HEIGHT) {
  if (Platform.OS === 'ios') {
    return extraOffset;
  }

  return getStatusBarHeight() + extraOffset;
}

export default { calculateKeyboardOffset };
