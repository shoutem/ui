import { Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { NAVIGATION_BAR_HEIGHT } from '../theme';

export function calculateKeyboardOffset(extraOffset = 0) {
  const resolvedOffset = NAVIGATION_BAR_HEIGHT + extraOffset;

  if (Platform.OS === 'ios') {
    return resolvedOffset;
  }

  if (Platform.OS === 'android') {
    return getStatusBarHeight() + resolvedOffset;
  }
}

export default { calculateKeyboardOffset };
