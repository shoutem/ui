import { View } from 'react-native';

import { connectStyle } from '@shoutem/theme';
import { connectAnimation } from '@shoutem/animation';

const AnimatedOverlay = connectAnimation(View);
const Overlay = connectStyle('shoutem.ui.Overlay')(AnimatedOverlay);

export {
  Overlay,
};
