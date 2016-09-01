import { View } from 'react-native';

import { connectStyle } from '@shoutem/theme';
import { connectAnimation } from '@shoutem/animation';

const AnimatedScreen = connectAnimation(View);
const Screen = connectStyle('shoutem.ui.Screen')(AnimatedScreen);

export {
  Screen,
};
