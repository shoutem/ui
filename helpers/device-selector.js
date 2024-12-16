import { Platform, StatusBar } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { initialWindowMetrics } from 'react-native-safe-area-context';

export const NAVIGATION_HEADER_HEIGHT = 64;

export const isNotchedAndroid =
  Platform.OS === 'android' && DeviceInfo.hasNotch();

export const NAVIGATION_BAR_HEIGHT = Platform.select({
  ios: NAVIGATION_HEADER_HEIGHT + initialWindowMetrics?.insets?.top,
  android: isNotchedAndroid
    ? NAVIGATION_HEADER_HEIGHT + StatusBar.currentHeight
    : NAVIGATION_HEADER_HEIGHT,
  default: NAVIGATION_HEADER_HEIGHT,
});

export const HOME_INDICATOR_PADDING =
  Platform.OS === 'ios' ? initialWindowMetrics?.insets?.bottom : 0;

export const NOTCH_AREA_HEIGHT = Platform.select({
  ios: initialWindowMetrics?.insets?.top,
  android: isNotchedAndroid ? StatusBar.currentHeight : 0,
  default: 0,
});

export const Device = {
  isNotchedAndroid,
  HOME_INDICATOR_PADDING,
  NOTCH_AREA_HEIGHT,
  NAVIGATION_HEADER_HEIGHT,
};
