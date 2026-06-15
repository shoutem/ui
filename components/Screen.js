import React from 'react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

const SafeAreaAwareView = ({ style, ...rest }) => {
  const insets = useSafeAreaInsets();

  // We only want Android bottom padding so content stays clear of Android
  // software OS navigation. If no padding, content goes under and user is unable
  // to see or press it.
  // On iOS - home indicator is transparent, so the content is visible. We should add
  // with-home-indicator-padding or paddingBottom for specific screens if there'll be
  // pressable component that would hide under home indicator.
  // Many screens already do this, so adding bottom inset by default on all screens would
  // cut off too much of screen content - we'll rather add padding where necessary.
  // Android will have this behavior as default because it's breaking UI bug.
  const safeAreaStyle = {
    paddingBottom: Platform.OS === 'android' ? insets.bottom : 0,
  };

  // Keep style after safeAreaStyle so Screen style can override safe area style.
  // with-home-indicator-padding and other classes already do this with theme resolution process.
  return <View {...rest} style={[safeAreaStyle, style]} />;
};

const AnimatedScreen = connectAnimation(SafeAreaAwareView);
const Screen = connectStyle('shoutem.ui.Screen')(AnimatedScreen);

export { Screen };
