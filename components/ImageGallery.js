import React, {
  PropTypes,
} from 'react';

import { ImagePreview } from './ImagePreview';
import { HorizontalPager } from './HorizontalPager';
import { connectStyle } from '@shoutem/theme';

const propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  sources: PropTypes.arrayOf(PropTypes.string),
};

function renderImagePreview({
  source,
  height,
  width,
}, key) {
  return (
    <ImagePreview
      source={source}
      width={width}
      height={height}
      key={key}
    />
  );
}

renderImagePreview.propTypes = {
  ...propTypes,
  source: PropTypes.shape({
    uri: PropTypes.string,
  }),
};

/**
 * Renders a collection of ImageGallery components within
 * a HorizontalPager. Each preview component is rendered
 * on a separate page.
 *
 * @returns {*}
 */
function ImageGallery({
  sources,
  width,
  height,
}) {
  function renderPage(src, key) {
    return renderImagePreview({
      source: {
        uri: src,
      },
      width,
      height,
    }, key);
  }

  return (
    <HorizontalPager
      width={width}
      height={height}
      dataSource={sources}
      renderPage={renderPage}
    />
  );
}

ImageGallery.propTypes = propTypes;

const StyledImageGallery = connectStyle('shoutem.ui.ImageGallery', {})(ImageGallery);

export {
  StyledImageGallery as ImageGallery,
};
