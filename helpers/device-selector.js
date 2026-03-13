import { Platform, StatusBar } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { initialWindowMetrics } from 'react-native-safe-area-context';

export const NAVIGATION_HEADER_HEIGHT = 64;

// Fallback inset values used when initialWindowMetrics is null (race condition
// in large apps where JS evaluates before the safe-area native module inits).
// Bottom: 34pt — consistent across all notched iPhones since iPhone X (2017).
// Top: 59pt — matches Dynamic Island devices (iPhone 14+).
//   Slightly too large for older notched devices (44–48pt), but using the
//   largest one prevents content from being hidden under the notch/Dynamic Island.
const DEFAULT_IOS_TOP_INSET = 59;
const DEFAULT_IOS_BOTTOM_INSET = 34;

export const isNotchedAndroid =
  Platform.OS === 'android' && DeviceInfo.hasNotch();

export const NAVIGATION_BAR_HEIGHT = Platform.select({
  ios:
    NAVIGATION_HEADER_HEIGHT +
    (initialWindowMetrics?.insets?.top ?? DEFAULT_IOS_TOP_INSET),
  android: isNotchedAndroid
    ? NAVIGATION_HEADER_HEIGHT + StatusBar.currentHeight
    : NAVIGATION_HEADER_HEIGHT,
  default: NAVIGATION_HEADER_HEIGHT,
});

export const HOME_INDICATOR_PADDING =
  Platform.OS === 'ios'
    ? initialWindowMetrics?.insets?.bottom ?? DEFAULT_IOS_BOTTOM_INSET
    : 0;

export const NOTCH_AREA_HEIGHT = Platform.select({
  ios: initialWindowMetrics?.insets?.top ?? DEFAULT_IOS_TOP_INSET,
  android: isNotchedAndroid ? StatusBar.currentHeight : 0,
  default: 0,
});

export const Device = {
  isNotchedAndroid,
  HOME_INDICATOR_PADDING,
  NOTCH_AREA_HEIGHT,
  NAVIGATION_HEADER_HEIGHT,
};

// Lazy getters — resolve initialWindowMetrics on first render,
// when the native module is guaranteed to be ready.
let _topInset;
let _bottomInset;

const getTopInset = () => {
  if (_topInset === undefined) {
    // eslint-disable-next-line global-require
    const metrics = require('react-native-safe-area-context')
      .initialWindowMetrics;
    _topInset = metrics?.insets?.top ?? DEFAULT_IOS_TOP_INSET;
  }

  return _topInset;
};

const getBottomInset = () => {
  if (_bottomInset === undefined) {
    // eslint-disable-next-line global-require
    const metrics = require('react-native-safe-area-context')
      .initialWindowMetrics;
    _bottomInset = metrics?.insets?.bottom ?? DEFAULT_IOS_BOTTOM_INSET;
  }

  return _bottomInset;
};

export const getNavigationBarHeight = () =>
  Platform.select({
    ios: NAVIGATION_HEADER_HEIGHT + getTopInset(),
    android: isNotchedAndroid
      ? NAVIGATION_HEADER_HEIGHT + StatusBar.currentHeight
      : NAVIGATION_HEADER_HEIGHT,
    default: NAVIGATION_HEADER_HEIGHT,
  });

export const getHomeIndicatorPadding = () =>
  Platform.OS === 'ios' ? getBottomInset() : 0;

export const getNotchAreaHeight = () =>
  Platform.select({
    ios: getTopInset(),
    android: isNotchedAndroid ? StatusBar.currentHeight : 0,
    default: 0,
  });
