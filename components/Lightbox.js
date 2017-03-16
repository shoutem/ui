import { default as Lightbox } from 'react-native-lightbox';

import { connectStyle } from '@shoutem/theme';
import { connectAnimation } from '@shoutem/animation';

const AnimatedLightbox = connectAnimation(Lightbox);
const StyledLightbox = connectStyle('shoutem.ui.Lightbox')(AnimatedLightbox);

export {
  StyledLightbox as Lightbox,
};
