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

// Bottom inset from the native safe-area module (home indicator on iOS,
// system nav bar on Android with edge-to-edge). Falls back to 34pt on iOS
// (race condition guard) or 0 on Android (no inset when edge-to-edge is off).
export const HOME_INDICATOR_PADDING =
  initialWindowMetrics?.insets?.bottom ??
  (Platform.OS === 'ios' ? DEFAULT_IOS_BOTTOM_INSET : 0);

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

    // Use actual bottom inset if available. Fallback: 34pt on iOS (safe
    // default for all notched iPhones), 0 on Android (no inset pre-RN 0.77).
    _bottomInset =
      metrics?.insets?.bottom ??
      (Platform.OS === 'ios' ? DEFAULT_IOS_BOTTOM_INSET : 0);
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

// Returns bottom safe area inset on both platforms. On iOS this is the home
// indicator area (34pt). On Android this is the system navigation bar height
// when edge-to-edge is enabled (RN 0.76+), or 0 on older RN versions.
export const getHomeIndicatorPadding = () => getBottomInset();

export const getNotchAreaHeight = () =>
  Platform.select({
    ios: getTopInset(),
    android: isNotchedAndroid ? StatusBar.currentHeight : 0,
    default: 0,
  });
