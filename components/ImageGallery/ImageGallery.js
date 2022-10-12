import React, { PureComponent } from 'react';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { HorizontalPager } from '../HorizontalPager';
import { Image } from '../Image';
import { LoadingIndicator } from '../LoadingIndicator';
import { View } from '../View';

const IMAGE_PREVIEW_MODE = 'imagePreview';
const IMAGE_GALLERY_MODE = 'gallery';

export class ImageGallery extends PureComponent {
  /**
   * The image preview mode is the mode in which
   * the user can zoom in/out and pan the image around.
   */
  static IMAGE_PREVIEW_MODE = IMAGE_PREVIEW_MODE;

  /**
   * The gallery mode is the mode in which
   * the user can scroll between images, and can see
   * additional info about each image.
   */
  static IMAGE_GALLERY_MODE = IMAGE_GALLERY_MODE;

  constructor(props) {
    super(props);

    autoBindReact(this);

    const { selectedIndex } = props;

    this.state = {
      selectedIndex,
      imageSwitchingEnabled: true,
      mode: IMAGE_GALLERY_MODE,
      // Disabling rule as this flag is used via inheritance in other classes.
      // eslint-disable-next-line react/no-unused-state
      collapsed: true,
    };
  }

  onImageTap() {
    const { mode } = this.state;

    // We are toggling between image preview and
    // gallery modes when the user taps on an image.
    if (mode === IMAGE_PREVIEW_MODE) {
      this.setMode(IMAGE_GALLERY_MODE);
    } else {
      this.setMode(IMAGE_PREVIEW_MODE);
    }
  }

  onIndexSelected(newIndex) {
    const { onIndexSelected } = this.props;
    this.setState(
      {
        selectedIndex: newIndex,
      },
      () => {
        if (_.isFunction(onIndexSelected)) {
          onIndexSelected(newIndex);
        }
      },
    );
  }

  setMode(newMode) {
    const { onModeChanged } = this.props;
    const { mode } = this.state;

    if (mode === newMode) {
      return;
    }

    this.setState({ mode }, () => {
      if (_.isFunction(onModeChanged)) {
        onModeChanged(mode);
      }
    });
  }

  renderImage(imageProps) {
    return (
      <ReactNativeZoomableView maxZoom={30}>
        <Image {...imageProps} />
      </ReactNativeZoomableView>
    );
  }

  renderPage(pageData, pageIndex) {
    const { mode, selectedIndex } = this.state;
    const { style, renderImageOverlay } = this.props;
    const image = _.get(pageData, 'source.uri');

    if (!image) {
      return null;
    }

    const isImageVisible = pageIndex === selectedIndex;
    const transformImageProps = Image.getPropsTransformer();
    const imageProps = {
      source: { uri: image },
      style: { flex: 1 },
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
        {this.renderImage(transformedImageProps, pageData, pageIndex)}
        {overlay}
      </View>
    );
  }

  render() {
    const {
      data,
      renderOverlay,
      renderPlaceholder,
      showNextPage,
      style,
    } = this.props;
    const { selectedIndex, imageSwitchingEnabled } = this.state;

    return (
      <View style={style.container} driver={this.timingDriver}>
        <HorizontalPager
          data={data}
          onIndexSelected={this.onIndexSelected}
          selectedIndex={selectedIndex}
          renderPage={this.renderPage}
          bounces
          pageMargin={style.pageMargin}
          showNextPage={showNextPage}
          renderOverlay={renderOverlay}
          renderPlaceholder={renderPlaceholder}
          scrollEnabled={imageSwitchingEnabled}
        />
      </View>
    );
  }
}

ImageGallery.propTypes = {
  // Array containing objects with gallery data (shape defined below)
  data: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      source: PropTypes.shape({
        uri: PropTypes.string,
      }),
      title: PropTypes.string,
    }),
  ).isRequired,
  // Style prop used to override default (theme) styling
  style: PropTypes.object.isRequired,
  // Renders an overlay over a single image
  // For example image gallery overlay using the `ImageGalleryOverlay` component
  // renderOverlay(imageData, imageIndex)
  renderImageOverlay: PropTypes.func,
  // Renders an overlay over all images
  // For example page indicators using the `PageIndicators` component
  // renderOverlay(imageData, imageIndex)
  renderOverlay: PropTypes.func,
  // Callback function that can be used to define placeholder
  // that appears when content is loading
  renderPlaceholder: PropTypes.func,
  // Initially selected page in gallery
  selectedIndex: PropTypes.number,
  showNextPage: PropTypes.bool,
  // Callback function called when user swipes between pages (images)
  // Index of new (selected) page is passed to this callback
  onIndexSelected: PropTypes.func,
  // onModeChanged(mode), callback function triggered when user taps on single photo
  // Or when user transforms (zooms etc.) image
  // Useful for hiding external controls (i.e. navigation bar)
  // Mode can be `gallery` or `imagePreview`
  onModeChanged: PropTypes.func,
};

ImageGallery.defaultProps = {
  selectedIndex: 0,
  showNextPage: false,
  renderPlaceholder: () => <LoadingIndicator />,
  renderImageOverlay: undefined,
  renderOverlay: undefined,
  onIndexSelected: undefined,
  onModeChanged: undefined,
};
