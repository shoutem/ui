import { Platform, StatusBar } from 'react-native';
import { NAVIGATION_BAR_HEIGHT } from './device-selector';

export function calculateKeyboardOffset(extraOffset = 0) {
  const resolvedOffset = NAVIGATION_BAR_HEIGHT + extraOffset;

  if (Platform.OS === 'ios') {
    return resolvedOffset;
  }

  return StatusBar.currentHeight + resolvedOffset;
}

// TODO: Deprecate and remove Keyboard.calculateKeyboardOffset
// Replace with direct function call. It's cleaner for any practical use of this
// because we will usually import Keyboard from react-native alongside this, so
// we're forced to rename imports.
export default { calculateKeyboardOffset };
