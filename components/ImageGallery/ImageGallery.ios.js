import React from 'react';
import { InteractionManager } from 'react-native';
import TransformableImage from 'react-native-transformable-image';

import { connectStyle } from '@shoutem/theme';

import { ImageGalleryBase } from './ImageGalleryBase';

class ImageGallery extends ImageGalleryBase {
  static IMAGE_PREVIEW_MODE = ImageGalleryBase.IMAGE_PREVIEW_MODE;
  static IMAGE_GALLERY_MODE = ImageGalleryBase.IMAGE_GALLERY_MODE;

  constructor(props) {
    super(props);

    this.onViewTransformed = this.onViewTransformed.bind(this);
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

  updateImageSwitchingStatus() {
    const { imageSwitchingEnabled, selectedIndex } = this.state;

    const imageTransformer = this.getImageTransformer(selectedIndex);
    if (!imageTransformer) {
      return;
    }

    const translationSpace = imageTransformer.getAvailableTranslateSpace();
    if (!translationSpace) {
      return;
    }

    const imageBoundaryReached = (translationSpace.right <= 0 || translationSpace.left <= 0);

    if (imageSwitchingEnabled !== imageBoundaryReached) {
      // We want to allow switching between gallery images only if
      // the image is at its left or right boundary. This happens if the
      // image is fully zoomed out, or if the image is zoomed in but the
      // user moved it to one of its boundaries.
      this.setState({
        imageSwitchingEnabled: imageBoundaryReached,
      });
    }
  }

  onViewTransformed() {
    this.updateImageSwitchingStatus();
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
    const { imageSwitchingEnabled } = this.state;

    const iosProps = {
      ...imageProps,
      onSingleTapConfirmed: this.onImageTap,
      onViewTransformed: this.onViewTransformed,
      enableTranslate: !imageSwitchingEnabled,
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
