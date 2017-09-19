import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image as RNImage } from 'react-native';
import { connectStyle } from '@shoutem/theme';
import _ from 'lodash';

import { Image } from '../../components/Image';
import { Lightbox } from '../../components/Lightbox';

/**
 * Remote images must have width and height to display correctly.
 * To get the best layout, correct image dimensions are needed.
 * Image is not going to be shown before dimensions are determined,
 * this component will determine the Image dimensions before rendering an image.
 */
export default class HtmlImage extends Component {
  static propTypes = {
    ...RNImage.propTypes,
    lightbox: PropTypes.bool,
    allowUpscale: PropTypes.bool,
  };

  static defaultProps = {
    lightbox: true,
    allowUpscale: false,
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
    const { children, style, allowUpscale } = this.props;
    const { width, height } = this.state;

    if (!style) {
      console.warn('Invalid Html image style. Html image requires style.width.');
      return null;
    }

    // Image can not be rendered without width and height.
    if (!height || !width) {
      return null;
    }

    // Do not enlarge image.
    // If image is smaller then image style width,
    // width that fits the screen best, use actual image width.
    const imageWidth = allowUpscale && style.width ? style.width : _.min([width, style.width]);

    const imageHeight = style.height || (imageWidth / width) * height;
    const { source, lightbox } = this.props;

    if (_.isEmpty(children) && lightbox) {
      // Showing image as part of the content, can be opened (zoomed).
      // Not background image (if it has any children)
      return (
        <Lightbox
          activeProps={{ styleName: 'preview wrapper' }}
          styleName="wrapper"
        >
          <Image
            {...this.props}
            source={{ width: imageWidth, height: imageHeight, ...source }}
          />
        </Lightbox>
      );
    }

    // Showing image as background, can't be opened (zoomed).
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
