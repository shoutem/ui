import React, { useCallback, useState } from 'react';
import { Pressable } from 'react-native';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { HorizontalPager } from './HorizontalPager';
import { Image } from './Image';
import { LoadingIndicator } from './LoadingIndicator';
import { View } from './View';

const IMAGE_PREVIEW_MODE = 'imagePreview';
const IMAGE_GALLERY_MODE = 'gallery';

function ImageGallery({
  data,
  onIndexSelected,
  onModeChanged,
  renderOverlay,
  renderImageOverlay,
  renderPlaceholder,
  selectedIndex,
  showNextPage,
  style,
}) {
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);
  const [mode, setMode] = useState(IMAGE_GALLERY_MODE);

  const handleImageTap = useCallback(
    newMode => {
      if (mode === IMAGE_PREVIEW_MODE) {
        setMode(IMAGE_GALLERY_MODE);
      } else {
        setMode(IMAGE_PREVIEW_MODE);
      }

      if (_.onModeChanged(newMode)) {
        onModeChanged(newMode);
      }
    },
    [mode, onModeChanged],
  );

  const handleIndexSelected = useCallback(
    newIndex => {
      setCurrentIndex(newIndex);

      if (_.isFunction(onIndexSelected)) {
        onIndexSelected(newIndex);
      }
    },
    [onIndexSelected],
  );

  const renderImage = useCallback(
    imageProps => {
      const imageStyle = imageProps?.style;
      const resolvedImageProps = _.omit(imageProps, 'style');

      return (
        <ReactNativeZoomableView
          maxZoom={1.5}
          minZoom={0.5}
          zoomStep={0.5}
          initialZoom={1}
          bindToBorders
        >
          <Pressable onPress={handleImageTap}>
            <Image style={[imageStyle, style.image]} {...resolvedImageProps} />
          </Pressable>
        </ReactNativeZoomableView>
      );
    },
    [handleImageTap, style.image],
  );

  function renderPage(pageData, pageIndex) {
    const image = _.get(pageData, 'source.uri');

    if (!image) {
      return null;
    }

    const isImageVisible = pageIndex === selectedIndex;
    const transformImageProps = Image.getPropsTransformer();
    const imageProps = {
      source: { uri: image },
    };
    const transformedImageProps = _.isFunction(transformImageProps)
      ? transformImageProps(imageProps)
      : imageProps;

    const showOverlay =
      _.isFunction(renderImageOverlay) &&
      // Nothing should be rendered above an image if the user is in
      // the preview mode (pinching, and panning the image).
      mode !== IMAGE_PREVIEW_MODE &&
      // We are not rendering overlays above images that are not visible
      isImageVisible;
    const overlay = showOverlay && renderImageOverlay(pageData, pageIndex);

    return (
      <View key={pageIndex} style={style.page}>
        {renderImage(transformedImageProps, pageData, pageIndex)}
        {overlay}
      </View>
    );
  }

  return (
    <View style={style.container}>
      <HorizontalPager
        data={data}
        onIndexSelected={handleIndexSelected}
        selectedIndex={currentIndex}
        renderPage={renderPage}
        bounces
        pageMargin={style.pageMargin}
        showNextPage={showNextPage}
        renderOverlay={renderOverlay}
        renderPlaceholder={renderPlaceholder}
        scrollEnabled
      />
    </View>
  );
}

ImageGallery.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      source: PropTypes.shape({
        uri: PropTypes.string,
      }),
      title: PropTypes.string,
    }),
  ).isRequired,
  style: PropTypes.object.isRequired,
  renderImageOverlay: PropTypes.func,
  renderOverlay: PropTypes.func,
  renderPlaceholder: PropTypes.func,
  selectedIndex: PropTypes.number,
  showNextPage: PropTypes.bool,
  onIndexSelected: PropTypes.func,
  onModeChanged: PropTypes.func,
};

ImageGallery.defaultProps = {
  renderImageOverlay: undefined,
  renderOverlay: undefined,
  renderPlaceholder: () => <LoadingIndicator />,
  selectedIndex: 0,
  showNextPage: false,
  onIndexSelected: undefined,
  onModeChanged: undefined,
};

const StyledImageGallery = connectStyle('shoutem.ui.ImageGallery')(
  ImageGallery,
);
export { StyledImageGallery as ImageGallery };
