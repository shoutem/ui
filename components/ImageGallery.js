import React, { Component, PropTypes } from 'react';

import {
  ScrollView,
  LayoutAnimation,
  InteractionManager,
} from 'react-native';

import { connectStyle } from '@shoutem/theme';
import { TimingDriver } from '@shoutem/animation';

import Image from 'react-native-transformable-image';
import _ from 'lodash';

import { Icon } from './Icon';
import { Subtitle } from './Text';
import { View } from './View';
import { TouchableOpacity } from './TouchableOpacity';
import { HorizontalPager } from './HorizontalPager';
import { LoadingIndicator } from './LoadingIndicator';

const DESCRIPTION_LENGTH_TRIM_LIMIT = 90;
const IMAGE_PREVIEW_MODE = 'imagePreview';
const IMAGE_GALLERY_MODE = 'gallery';

class ImageGallery extends Component {
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
    // Callback function that can be used to render overlay over pages
    // For example page indicators using `PageIndicators` component
    // renderOverlay(selectedIndex, data)
    renderOverlay: PropTypes.func,
    // Callback function that can be used to define placeholder
    // that appears when content is loading
    renderPlaceholder: PropTypes.func,
  };

  static defaultProps = {
    selectedIndex: 0,
    showNextPage: false,
    renderPlaceholder: () => {
      return (
        <LoadingIndicator />
      );
    },
  }

  timingDriver = new TimingDriver();
  imageRefs = new Map();

  constructor(props) {
    super(props);
    this.renderPage = this.renderPage.bind(this);
    this.onIndexSelected = this.onIndexSelected.bind(this);
    this.collapseDescription = this.collapseDescription.bind(this);
    this.expandDescription = this.expandDescription.bind(this);
    this.onDescriptionScroll = this.onDescriptionScroll.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
    this.renderDescription = this.renderDescription.bind(this);
    this.onViewTransformed = this.onViewTransformed.bind(this);
    this.onSingleTapConfirmed = this.onSingleTapConfirmed.bind(this);
    this.resetSurroundingImageTransformations = this.resetSurroundingImageTransformations.bind(this);
    this.getImageTransformer = this.getImageTransformer.bind(this);
    this.updateImageSwitchingStatus = this.updateImageSwitchingStatus.bind(this);
    this.setImagePreviewMode = this.setImagePreviewMode.bind(this);
    this.setGalleryMode = this.setGalleryMode.bind(this);
    this.state = {
      selectedIndex: this.props.selectedIndex || 0,
      collapsed: true,
      mode: IMAGE_GALLERY_MODE,
      imageSwitchingEnabled: true,
    };
  }

  onIndexSelected(newIndex) {
    const { onIndexSelected } = this.props;
    this.setState({
      selectedIndex: newIndex,
    }, () => {
      if (_.isFunction(onIndexSelected)) {
        onIndexSelected(newIndex);
      }
      InteractionManager.runAfterInteractions(() => {
        // After swipe interaction finishes, we'll have new selected index in state
        // And we're resetting surrounding image transformations,
        // So that images aren't left zoomed in when user swipes to next/prev image
        this.resetSurroundingImageTransformations();
      });
    });
  }

  getSelectedIndex() {
    const { selectedIndex } = this.state;

    return selectedIndex;
  }

  collapseDescription() {
    LayoutAnimation.easeInEaseOut();
    this.setState({ collapsed: false });
  }

  expandDescription() {
    LayoutAnimation.easeInEaseOut();
    this.setState({ collapsed: true });
  }

  onDescriptionScroll(event) {
    const { collapsed } = this.state;
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 0 && collapsed) {
      this.collapseDescription();
    }
    if (offsetY < 0 && !collapsed) {
      this.expandDescription();
    }
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
      // the image is at its left of right boundary. This happens if the
      // image is fully zoomed out, or if the image is zoomed in but the
      // user moved it to one of its boundaries.
      this.setState({
        imageSwitchingEnabled: imageBoundaryReached,
      });
    }
  }

  setImagePreviewMode() {
    const { onModeChanged } = this.props;

    this.setState({ mode: IMAGE_PREVIEW_MODE });

    this.timingDriver.runTimer(1, () => {
      if (_.isFunction(onModeChanged)) {
        onModeChanged(IMAGE_PREVIEW_MODE);
      }
    });
  }

  setGalleryMode() {
    const { onModeChanged } = this.props;

    this.setState({ mode: IMAGE_GALLERY_MODE });

    this.timingDriver.runTimer(0, () => {
      if (_.isFunction(onModeChanged)) {
        onModeChanged(IMAGE_GALLERY_MODE);
      }
    });
  }

  onViewTransformed(event) {
    const { mode } = this.state;

    if (event.scale > 1.0 && mode === IMAGE_GALLERY_MODE) {
      // If controls are visible and image is transformed,
      // We should switch to image preview mode
      this.setImagePreviewMode();
    } else if (mode === IMAGE_PREVIEW_MODE) {
      this.updateImageSwitchingStatus();
    }
  }

  onSingleTapConfirmed() {
    const { mode } = this.state;

    if (mode === IMAGE_PREVIEW_MODE) {
      // If controls are not visible and user taps on image
      // We should switch to gallery mode
      this.setGalleryMode();
    } else {
      this.setImagePreviewMode();
    }
  }

  renderDescription(description) {
    const { collapsed } = this.state;
    const { style } = this.props;

    if (!description) return;

    const descriptionIcon = collapsed ? <Icon name="up-arrow" /> : <Icon name="down-arrow" />;

    const descriptionText = (
      <Subtitle
        style={style.description.text}
        numberOfLines={collapsed ? 2 : null}
      >
        {description}
      </Subtitle>
    );

    return (
      <View
        style={style.description.container}
        driver={this.timingDriver}
        animationName="lightsOffTransparent"
      >
        <TouchableOpacity onPress={collapsed ? this.collapseDescription : this.expandDescription}>
          {description.length >= DESCRIPTION_LENGTH_TRIM_LIMIT ? descriptionIcon : null}
        </TouchableOpacity>
        <ScrollView
          onScroll={this.onDescriptionScroll}
          scrollEventThrottle={200}
          style={style.description.scroll}
        >
          {descriptionText}
        </ScrollView>
      </View>
    );
  }

  renderTitle(title) {
    const { style } = this.props;

    return (
      <View
        style={style.title.container}
        driver={this.timingDriver}
        animationName="lightsOffTransparent"
      >
        <Subtitle style={style.title.text} numberOfLines={2}>{title}</Subtitle>
      </View>
    );
  }

  getImageTransformer(page) {
    const { data } = this.props;
    if (page >= 0 && page < data.length) {
      const ref = this.imageRefs.get(page);
      if (ref) {
        return ref.getViewTransformerInstance();
      }
    }
    return null;
  }

  resetImageTransformer(transformer) {
    transformer.updateTransform({ scale: 1, translateX: 0, translateY: 0 });
  }

  resetSurroundingImageTransformations() {
    const { selectedIndex } = this.state;
    let transformer = this.getImageTransformer(selectedIndex - 1);
    if (transformer) {
      this.resetImageTransformer(transformer);
    }
    transformer = this.getImageTransformer(selectedIndex + 1);
    if (transformer) {
      this.resetImageTransformer(transformer);
    }
  }

  renderPage(page, pageId) {
    const { style } = this.props;
    const { imageSwitchingEnabled } = this.state;
    const image = _.get(page, 'source.uri');
    const title = _.get(page, 'title');
    const description = _.get(page, 'description');

    if (!image) {
      return;
    }

    return (
      <View
        style={style.page}
        key={pageId}
      >
        <Image
          source={{ uri: image }}
          style={{ flex: 1 }}
          onViewTransformed={this.onViewTransformed}
          onSingleTapConfirmed={this.onSingleTapConfirmed}
          enableTranslate={!imageSwitchingEnabled}
          ref={((ref) => { this.imageRefs.set(pageId, ref); })}
        />
        { this.renderTitle(title) }
        { this.renderDescription(description) }
      </View>
    );
  }

  render() {
    const { data, renderOverlay, renderPlaceholder, style } = this.props;
    const { imageSwitchingEnabled, selectedIndex } = this.state;

    return (
      <View
        style={style.container}
        driver={this.timingDriver}
        animationName="lightsOff"
      >
        <HorizontalPager
          data={data}
          onIndexSelected={this.onIndexSelected}
          selectedIndex={selectedIndex}
          renderPage={this.renderPage}
          scrollEnabled={imageSwitchingEnabled}
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

const StyledImageGallery = connectStyle('shoutem.ui.ImageGallery')(ImageGallery);

export {
  StyledImageGallery as ImageGallery,
};
