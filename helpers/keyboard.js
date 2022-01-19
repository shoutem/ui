import { Platform, StatusBar } from 'react-native';
import { NAVIGATION_BAR_HEIGHT } from '../theme';

export function calculateKeyboardOffset(extraOffset = 0) {
  const resolvedOffset = NAVIGATION_BAR_HEIGHT + extraOffset;

  if (Platform.OS === 'ios') {
    return resolvedOffset;
  }

  return StatusBar.currentHeight + resolvedOffset;
}

export default { calculateKeyboardOffset };
