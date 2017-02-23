import React, { Component, PropTypes } from 'react';

import _ from 'lodash';

import {
  View,
  HorizontalPager,
  LoadingIndicator,
  Image,
} from '../../index';

const IMAGE_PREVIEW_MODE = 'imagePreview';
const IMAGE_GALLERY_MODE = 'gallery';

export class BaseImageGallery extends Component {
  static propTypes = {
    // Array containing objects with gallery data (shape defined below)
    data: PropTypes.arrayOf(
      PropTypes.shape({
        source: PropTypes.shape({
          uri: PropTypes.string,
        }),
        description: PropTypes.string,
        title: PropTypes.string,
      }),
    ).isRequired,
    // Callback function called when user swipes between pages (images)
    // Index of new (selected) page is passed to this callback
    onIndexSelected: PropTypes.func,
    // Initially selected page in gallery
    selectedIndex: PropTypes.number,
    // onModeChanged(mode), callback function triggered when user taps on single photo
    // Or when user transforms (zooms etc.) image
    // Useful for hiding external controls (i.e. navigation bar)
    // Mode can be `gallery` or `imagePreview`
    onModeChanged: PropTypes.func,
    // Style prop used to override default (theme) styling
    style: PropTypes.object,
    // Renders an overlay over all images
    // For example page indicators using the `PageIndicators` component
    // renderOverlay(imageData, imageIndex)
    renderOverlay: PropTypes.func,
    // Renders an overlay over a single image
    // For example image gallery overlay using the `ImageGalleryOverlay` component
    // renderOverlay(imageData, imageIndex)
    renderImageOverlay: PropTypes.func,
    // Callback function that can be used to define placeholder
    // that appears when content is loading
    renderPlaceholder: PropTypes.func,
  };

  static defaultProps = {
    selectedIndex: 0,
    showNextPage: false,
    renderPlaceholder: () => <LoadingIndicator />,
  };

  constructor(props) {
    super(props);
    this.renderPage = this.renderPage.bind(this);
    this.onIndexSelected = this.onIndexSelected.bind(this);
    this.onImageTap = this.onImageTap.bind(this);
    this.setImagePreviewMode = this.setImagePreviewMode.bind(this);
    this.setGalleryMode = this.setGalleryMode.bind(this);

    this.state = {
      selectedIndex: this.props.selectedIndex || 0,
      collapsed: true,
      mode: IMAGE_GALLERY_MODE,
    };
  }

  onImageTap() {
    const { mode } = this.state;

    if (mode === IMAGE_PREVIEW_MODE) {
      // If controls are not visible and user taps on image
      // We should switch to gallery mode
      this.setGalleryMode();
    } else {
      this.setImagePreviewMode();
    }
  }

  onIndexSelected(newIndex) {
    const { onIndexSelected } = this.props;
    this.setState({
      selectedIndex: newIndex,
    }, () => {
      if (_.isFunction(onIndexSelected)) {
        onIndexSelected(newIndex);
      }
    });
  }

  /**
   * Sets the image preview mode, this is the mode in which
   * the user can zoom in/out and pan the image around.
   */
  setImagePreviewMode() {
    const { onModeChanged } = this.props;

    this.setState({ mode: IMAGE_PREVIEW_MODE }, () => {
      if (_.isFunction(onModeChanged)) {
        onModeChanged(IMAGE_PREVIEW_MODE);
      }
    });
  }

  /**
   * Sets the gallery mode. This is the mode in which
   * the user can scroll between images, and can see
   * additional info about each image.
   */
  setGalleryMode() {
    const { onModeChanged } = this.props;

    this.setState({ mode: IMAGE_GALLERY_MODE }, () => {
      if (_.isFunction(onModeChanged)) {
        onModeChanged(IMAGE_GALLERY_MODE);
      }
    });
  }

  renderImage() {
    // Override this to provide platform specific UI
  }

  renderPage(pageData, pageIndex) {
    const { mode, selectedIndex } = this.state;
    const { style, renderImageOverlay } = this.props;
    const image = _.get(pageData, 'source.uri');

    if (!image) {
      return null;
    }

    const isImageVisible = (pageIndex === selectedIndex);
    const transformImageProps = Image.getPropsTransformer();
    const imageProps = {
      source: { uri: image },
      style: { flex: 1 },
    };
    const transformedImageProps = transformImageProps ?
      transformImageProps(imageProps) :
      imageProps;

    const showOverlay = _.isFunction(renderImageOverlay) &&
      // Nothing should be rendered above an image if the user is in
      // the preview mode (pinching, and panning the image).
      (mode !== IMAGE_PREVIEW_MODE) &&
      // We are not rendering overlays above images that are not visible
      isImageVisible;
    const overlay = showOverlay && renderImageOverlay(pageData, pageIndex);

    return (
      <View
        key={pageIndex}
        style={style.page}
      >
        {this.renderImage(transformedImageProps, pageData, pageIndex)}
        {overlay}
      </View>
    );
  }

  render() {
    const { data, renderOverlay, renderPlaceholder, style } = this.props;
    const { selectedIndex } = this.state;

    return (
      <View
        style={style.container}
        driver={this.timingDriver}
      >
        <HorizontalPager
          data={data}
          onIndexSelected={this.onIndexSelected}
          selectedIndex={selectedIndex}
          renderPage={this.renderPage}
          bounces
          pageMargin={style.pageMargin}
          showNextPage={false}
          renderOverlay={renderOverlay}
          renderPlaceholder={renderPlaceholder}
        />
      </View>
    );
  }
}
