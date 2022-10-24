import React, { PureComponent } from 'react';
import RNLightbox from 'react-native-lightbox-v2';
import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

// Exporting as class because Animated.createAnimatedComponent
// doesn't support stateless functional components
class Lightbox extends PureComponent {
  render() {
    return <RNLightbox {...this.props} />;
  }
}

const AnimatedLightbox = connectAnimation(Lightbox);
const StyledLightbox = connectStyle('shoutem.ui.Lightbox')(AnimatedLightbox);

export { StyledLightbox as Lightbox };
