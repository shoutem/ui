import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Image } from '../Image';
import { View } from '../View';

/**
 * A single ImageCarousel slide: a rounded card that fills its parent, holding a
 * cover image and, on top of it, whatever the caller renders as overlay. While
 * the image is loading, the caller's image placeholder is rendered above it.
 *
 * @param {Object} item The slide data item, forwarded to the render callbacks.
 * @param {number} index The slide's index in the carousel data.
 * @param {boolean} isActive Whether this slide is the carousel's active one.
 * @param {Object} source A React Native image source for the slide's image.
 * @param {Function} [renderOverlay] `(item, { index, isActive }) => JSX.Element`
 *   rendered on top of the image.
 * @param {Function} [renderImagePlaceholder] `(item, { index }) => JSX.Element`
 *   rendered over the image until it finishes loading.
 * @param {Object} style Resolved styles, injected by connectStyle.
 * @returns {JSX.Element}
 */
const ImageCarouselSlide = ({
  item,
  index = 0,
  isActive = false,
  source,
  renderOverlay,
  renderImagePlaceholder,
  style = {},
}) => {
  const [isImageLoaded, setImageLoaded] = useState(false);

  const handleImageLoadEnd = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const placeholder =
    !isImageLoaded && renderImagePlaceholder
      ? renderImagePlaceholder(item, { index })
      : null;
  const overlay = renderOverlay
    ? renderOverlay(item, { index, isActive })
    : null;

  return (
    <View style={style.card}>
      <Image
        source={source}
        style={style.image}
        resizeMode="cover"
        onLoadEnd={handleImageLoadEnd}
      />
      {placeholder}
      {overlay}
    </View>
  );
};

ImageCarouselSlide.propTypes = {
  index: PropTypes.number,
  isActive: PropTypes.bool,
  item: PropTypes.object,
  renderImagePlaceholder: PropTypes.func,
  renderOverlay: PropTypes.func,
  source: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  style: PropTypes.object,
};

const StyledImageCarouselSlide = connectStyle('shoutem.ui.ImageCarouselSlide')(
  ImageCarouselSlide,
);

export { StyledImageCarouselSlide as ImageCarouselSlide };
