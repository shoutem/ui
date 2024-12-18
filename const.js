import { Platform, StatusBar } from 'react-native';
import {
  HOME_INDICATOR_PADDING,
  NAVIGATION_BAR_HEIGHT,
  NAVIGATION_HEADER_HEIGHT,
  NOTCH_AREA_HEIGHT,
} from './helpers';

const STATUS_BAR_OFFSET =
  Platform.OS === 'android' ? -StatusBar.currentHeight : 0;

// TODO: Deprecate and remove exports from here
// Currently leaving for backwards compatibility
export {
  HOME_INDICATOR_PADDING,
  NAVIGATION_BAR_HEIGHT,
  NAVIGATION_HEADER_HEIGHT,
  NOTCH_AREA_HEIGHT,
  STATUS_BAR_OFFSET,
};
