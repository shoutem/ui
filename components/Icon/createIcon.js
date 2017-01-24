import { connectStyle } from '@shoutem/theme';
import { connectAnimation } from '@shoutem/animation';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import createConfig from './createConfig';

/**
 * Create Icon component with wanted font family and styleName (optional).
 * Usage: <Icon name="icon-name" size={20} color="#4F8EF7" />
 * @param fontFamily - font used for icons (icon font)
 * @param componentStyleName
 */
export default function (fontFamily, componentStyleName = 'shoutem.ui.Icon') {
  const config = createConfig(fontFamily);
  const IconComponent = createIconSetFromIcoMoon(config);
  const AnimatedIcon = connectAnimation(IconComponent);
  return connectStyle(componentStyleName)(AnimatedIcon);
}
