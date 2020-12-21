import { default as Lightbox } from 'react-native-lightbox';
import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

const AnimatedLightbox = connectAnimation(Lightbox);
const StyledLightbox = connectStyle('shoutem.ui.Lightbox')(AnimatedLightbox);

export { StyledLightbox as Lightbox };
