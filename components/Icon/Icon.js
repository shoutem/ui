/**
 * Icon component.
 * Usage: <Icon name="icon-name" size={20} color="#4F8EF7" />
 */

import { connectStyle } from '@shoutem/theme';
import { connectAnimation } from '@shoutem/animation';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from './config.json';

const IconComponent = createIconSetFromIcoMoon(icoMoonConfig);
const AnimatedIcon = connectAnimation(IconComponent);
const Icon = connectStyle('shoutem.ui.Icon')(AnimatedIcon);

export {
  Icon,
};
