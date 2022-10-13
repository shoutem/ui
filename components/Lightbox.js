import Lightbox from 'react-native-lightbox-v2';
import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

const AnimatedLightbox = connectAnimation(Lightbox);
const StyledLightbox = connectStyle('shoutem.ui.Lightbox')(AnimatedLightbox);

export { StyledLightbox as Lightbox };
