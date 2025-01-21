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

export const DEFAULT_PROGRESS_COLORS = [
  '#FF0000', // Red
  '#FF4500', // Orange-Red
  '#FFA500', // Orange
  '#FFD700', // Yellow
  '#ADFF2F', // Yellow-Green
  '#90EE90', // Light Green
];
