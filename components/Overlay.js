import { View } from 'react-native';

import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

const AnimatedOverlay = connectAnimation(View);
const Overlay = connectStyle('shoutem.ui.Overlay')(AnimatedOverlay);

export {
  Overlay,
};
