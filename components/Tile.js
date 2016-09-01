import { View } from 'react-native';

import { connectStyle } from '@shoutem/theme';
import { connectAnimation } from '@shoutem/animation';

const AnimatedTile = connectAnimation(View);
const Tile = connectStyle('shoutem.ui.Tile')(AnimatedTile);

export {
  Tile,
};
