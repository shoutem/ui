import React from 'react';
import PhotoView from 'react-native-photo-view';

import { connectStyle } from '@shoutem/theme';

import { ImageGalleryBase } from './ImageGalleryBase';

class ImageGallery extends ImageGalleryBase {
  static IMAGE_PREVIEW_MODE = ImageGalleryBase.IMAGE_PREVIEW_MODE;
  static IMAGE_GALLERY_MODE = ImageGalleryBase.IMAGE_GALLERY_MODE;

  renderImage(imageProps, imageData, imageIndex) {
    const { selectedIndex } = this.state;

    const isImageVisible = (imageIndex === selectedIndex);
    const androidProps = {
      ...imageProps,
      // Reset the image scale on images that are not
      // currently visible
      scale: isImageVisible ? null : 1,
      minimumZoomScale: 1,
      maximumZoomScale: 3,
      androidScaleType: 'fitCenter',
      onTap: this.onImageTap,
    };

    return (
      <PhotoView {...androidProps} />
    );
  }
}

const StyledImageGallery = connectStyle('shoutem.ui.ImageGallery')(ImageGallery);

export {
  StyledImageGallery as ImageGallery,
};
