import { View } from 'react-native';
import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

const AnimatedScreen = connectAnimation(View);
const Screen = connectStyle('shoutem.ui.Screen')(AnimatedScreen);

export { Screen };
