import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

const SafeAreaAwareView = ({ style, ...rest }) => {
  const insets = useSafeAreaInsets();
  const safeAreaStyle = { paddingBottom: insets.bottom };

  return <View {...rest} style={[style, safeAreaStyle]} />;
};

const AnimatedScreen = connectAnimation(SafeAreaAwareView);
const Screen = connectStyle('shoutem.ui.Screen')(AnimatedScreen);

export { Screen };
