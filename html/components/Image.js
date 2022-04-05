import React, { PureComponent } from 'react';
import { Image as RNImage } from 'react-native';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Image } from '../../components/Image';
import { ImageBackground } from '../../components/ImageBackground';
import { Lightbox } from '../../components/Lightbox';

/**
 * Remote images must have width and height to display correctly.
 * To get the best layout, correct image dimensions are needed.
 * Image is not going to be shown before dimensions are determined,
 * this component will determine the Image dimensions before rendering an image.
 */
export default class HtmlImage extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      width: null,
      height: null,
    };

    RNImage.getSize(
      props.source.uri,
      this.imageSizeLoaded,
      this.imageSizeLoadFailed,
    );
  }

  imageSizeLoaded(width, height) {
    this.setState({ width, height });
  }

  imageSizeLoadFailed() {
    // TODO - handle properly
    // eslint-disable-next-line no-console
    console.warn(
      'Could not load image size for image: ',
      this.props.source.uri,
    );
  }

  render() {
    const { children, style, allowUpscale } = this.props;
    const { width, height } = this.state;

    if (!style) {
      // eslint-disable-next-line no-console
      console.warn(
        'Invalid Html image style. Html image requires style.width.',
      );
      return null;
    }

    // Image can not be rendered without width and height.
    if (!height || !width) {
      return null;
    }

    // Do not enlarge image.
    // If image is smaller then image style width,
    // width that fits the screen best, use actual image width.
    const imageWidth =
      allowUpscale && style.width ? style.width : _.min([width, style.width]);

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
      <ImageBackground
        {...this.props}
        source={{ width: imageWidth, height: imageHeight, ...source }}
      >
        {children}
      </ImageBackground>
    );
  }
}

HtmlImage.propTypes = {
  ...RNImage.propTypes,
  allowUpscale: PropTypes.bool,
  lightbox: PropTypes.bool,
};

HtmlImage.defaultProps = {
  allowUpscale: false,
  lightbox: true,
};
