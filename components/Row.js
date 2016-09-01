import { View } from 'react-native';

import { connectStyle } from '@shoutem/theme';
import { connectAnimation } from '@shoutem/animation';

const AnimatedRow = connectAnimation(View);
const Row = connectStyle('shoutem.ui.Row')(AnimatedRow);

export {
  Row,
};
