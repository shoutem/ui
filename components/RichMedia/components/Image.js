import React, { Component } from 'react';
import { Image } from '@shoutem/ui';
import { Image as RNImage } from 'react-native';
import { connectStyle } from '@shoutem/theme';

/**
 * Remote images must have width and height to display correctly.
 * To get the best layout, correct image dimensions are needed.
 * Image is not going to be shown before dimensions are determined,
 * this component will determine the Image dimensions before rendering an image.
 */
export default class RichMediaImage extends Component {
  static propTypes = {
    ...RNImage.propTypes,
  };

  constructor(props) {
    super(props);

    this.state = {
      width: null,
      height: null,
    };

    this.imageSizeLoaded = this.imageSizeLoaded.bind(this);
    RNImage.getSize(props.source.uri, this.imageSizeLoaded, this.imageSizeLoadFailed);
  }

  imageSizeLoaded(width, height) {
    this.setState({ width, height });
  }

  imageSizeLoadFailed() {
    // TODO - handle properly
    console.log('Could not load image size for image: ', this.props.source.uri);
  }

  render() {
    const { children, style } = this.props;
    const { width, height } = this.state;
    const imageWidth = style.width;

    if ((!height && (!style.height || !imageWidth)) || !width) {
      return null;
    }

    const imageHeight = style.height || (imageWidth / width) * height;
    const { source } = this.props;

    return (
      <Image
        {...this.props}
        source={{ width: imageWidth, height: imageHeight, ...source }}
      >
        {children}
      </Image>
    );
  }
}
