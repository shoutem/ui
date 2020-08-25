import { View } from 'react-native';

import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

const AnimatedCard = connectAnimation(View);
const Card = connectStyle('shoutem.ui.Card')(AnimatedCard);

export {
  Card,
};
