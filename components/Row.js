import { View } from 'react-native';
import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

const AnimatedRow = connectAnimation(View);
const Row = connectStyle('shoutem.ui.Row')(AnimatedRow);

export { Row };
