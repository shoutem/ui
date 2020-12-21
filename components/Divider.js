import { View } from 'react-native';
import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

const AnimatedDivider = connectAnimation(View);
const Divider = connectStyle('shoutem.ui.Divider')(AnimatedDivider);

export { Divider };
