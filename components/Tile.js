import { View } from 'react-native';
import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

const AnimatedTile = connectAnimation(View);
const Tile = connectStyle('shoutem.ui.Tile')(AnimatedTile);

export { Tile };
