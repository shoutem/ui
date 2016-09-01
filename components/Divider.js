import { View } from 'react-native';

import { connectStyle } from '@shoutem/theme';
import { connectAnimation } from '@shoutem/animation';

const AnimatedDivider = connectAnimation(View);
const Divider = connectStyle('shoutem.ui.Divider')(AnimatedDivider);

export {
  Divider,
};
