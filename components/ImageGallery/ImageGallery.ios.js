import React from 'react';
import { InteractionManager } from 'react-native';
import TransformableImage from 'react-native-transformable-image';

import { connectStyle } from '@shoutem/theme';

import { ImageGalleryBase } from './ImageGalleryBase';

class ImageGallery extends ImageGalleryBase {
  constructor(props) {
    super(props);

    this.imageRefs = new Map();
  }

  getImageTransformer(index) {
    const { data } = this.props;
    if (index >= 0 && index < data.length) {
      const ref = this.imageRefs.get(index);
      if (ref) {
        return ref.getViewTransformerInstance();
      }
    }
    return null;
  }

  resetImageTransformer(transformer) {
    if (!transformer) {
      return;
    }

    transformer.updateTransform({
      scale: 1,
      translateX: 0,
      translateY: 0,
    });
  }

  resetSurroundingImageTransformations(index) {
    this.resetImageTransformer(this.getImageTransformer(index - 1));
    this.resetImageTransformer(this.getImageTransformer(index + 1));
  }

  onIndexSelected(newIndex) {
    super.onIndexSelected(newIndex);

    InteractionManager.runAfterInteractions(() => {
      // After swipe interaction finishes, we'll have new selected index in state
      // And we're resetting surrounding image transformations,
      // So that images aren't left zoomed in when user swipes to next/prev image
      this.resetSurroundingImageTransformations(newIndex);
    });
  }

  renderImage(imageProps, imageData, imageIndex) {
    const iosProps = {
      ...imageProps,
      onSingleTapConfirmed: this.onImageTap,
      ref: transformer => {
        this.imageRefs.set(imageIndex, transformer);
      },
    };

    return (
      <TransformableImage {...iosProps} />
    );
  }
}

const StyledImageGallery = connectStyle('shoutem.ui.ImageGallery')(ImageGallery);

export {
  StyledImageGallery as ImageGallery,
};
