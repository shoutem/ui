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

const DESCRIPTION_LENGTH_TRIM_LIMIT = 90;

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
    // onModeChanged, callback function triggered when user taps on single photo
    // Or when user transforms (zooms etc.) image
    // Useful for hiding external controls (i.e. navigation bar)
    onModeChanged: PropTypes.func,
    // Style prop used to override default (theme) styling
    style: PropTypes.object,
    // pageMargin
    pageMargin: PropTypes.number,
  };

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
    this.resetCurrentImageTransformation = this.resetCurrentImageTransformation.bind(this);
    this.resetSurroundingImageTransformations = this.resetSurroundingImageTransformations.bind(this);
    this.getImageTransformer = this.getImageTransformer.bind(this);
    this.updateImageTransformedStatus = this.updateImageTransformedStatus.bind(this);
    this.state = {
      selectedIndex: this.props.selectedIndex || 0,
      collapsed: true,
      controlsVisible: true,
      imageTransformed: true,
      pageMargin: this.props.pageMargin || 0,
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

  updateImageTransformedStatus() {
    const { imageTransformed, selectedIndex } = this.state;
    const transformer = this.getImageTransformer(selectedIndex);

    if (transformer) {
      const space = transformer.getAvailableTranslateSpace();

      if (!space) {
        return;
      }

      if ((space.right > 0 && space.left > 0) && imageTransformed) {
        this.setState({ imageTransformed: false });
      }

      if ((space.right <= 0 || space.left <= 0) && !imageTransformed) {
        this.setState({ imageTransformed: true });
      }
    }
  }

  onViewTransformed(event) {
    const { controlsVisible } = this.state;
    const { onModeChanged } = this.props;

    if (event.scale > 1.0 && controlsVisible) {
      // If controls are visible and image is transformed,
      // We should hide controls and trigger animation
      if (_.isFunction(onModeChanged)) {
        onModeChanged(true);
      }
      this.timingDriver.runTimer(1);
      this.setState({ controlsVisible: false });
    } else if (!controlsVisible) {
      this.updateImageTransformedStatus();
    }
  }

  onSingleTapConfirmed() {
    const { controlsVisible } = this.state;
    const { onModeChanged } = this.props;

    if (!controlsVisible) {
      // If controls are not visible and user taps on image
      // We should reset current image transformation (set scale to 1.0)
      this.timingDriver.runTimer(0, () => {
        if (_.isFunction(onModeChanged)) {
          onModeChanged(false);
        }
      });
      this.resetCurrentImageTransformation();
    } else {
      if (_.isFunction(onModeChanged)) {
        onModeChanged(true);
      }
      this.timingDriver.runTimer(1);
    }
    // And toggle visibility of controls
    this.setState({
      controlsVisible: !controlsVisible,
    });
  }

  renderDescription(description) {
    const { collapsed } = this.state;
    const { style } = this.props;

    if (!description) return;

    const descriptionIcon = collapsed ? <Icon name="up-arrow" /> : <Icon name="down-arrow" />;

    const descriptionText = (
      <Subtitle
        style={style.description}
        numberOfLines={collapsed ? 2 : null}
      >
        {description}
      </Subtitle>
    );

    return (
      <View
        renderToHardwareTextureAndroid
        style={style.fixedDescription}
        driver={this.timingDriver}
        animationName="lightsOffTransparent"
      >
        <TouchableOpacity onPress={collapsed ? this.collapseDescription : this.expandDescription}>
          {description.length >= DESCRIPTION_LENGTH_TRIM_LIMIT ? descriptionIcon : null}
        </TouchableOpacity>
        <View style={style.innerDescription}>
          <ScrollView
            onScroll={this.onDescriptionScroll}
            scrollEventThrottle={200}
            style={style.descriptionScroll}
          >
            {descriptionText}
          </ScrollView>
        </View>
      </View>
    );
  }

  renderTitle(title) {
    const { style } = this.props;

    return (
      <View
        renderToHardwareTextureAndroid
        style={style.fixedTitle}
        driver={this.timingDriver}
        animationName="lightsOffTransparent"
      >
        <Subtitle style={style.title} numberOfLines={2}>{title}</Subtitle>
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

  resetCurrentImageTransformation() {
    const { selectedIndex } = this.state;
    const transformer = this.getImageTransformer(selectedIndex);
    if (transformer) {
      transformer.updateTransform({ scale: 1, translateX: 0, translateY: 0 });
    }
  }

  resetSurroundingImageTransformations() {
    const { selectedIndex } = this.state;
    let transformer = this.getImageTransformer(selectedIndex - 1);
    if (transformer) {
      transformer.updateTransform({ scale: 1, translateX: 0, translateY: 0 });
    }
    transformer = this.getImageTransformer(selectedIndex + 1);
    if (transformer) {
      transformer.updateTransform({ scale: 1, translateX: 0, translateY: 0 });
    }
  }

  renderPage(page, pageId) {
    const { style } = this.props;
    const { imageTransformed } = this.state;
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
        renderToHardwareTextureAndroid
      >
        <Image
          source={{ uri: image }}
          style={{ flex: 1 }}
          onViewTransformed={this.onViewTransformed}
          onSingleTapConfirmed={this.onSingleTapConfirmed}
          enableTranslate={!imageTransformed}
          ref={((ref) => { this.imageRefs.set(pageId, ref); })}
        />
        { this.renderTitle(title) }
        { this.renderDescription(description) }
      </View>
    );
  }

  render() {
    const { data } = this.props;
    const { imageTransformed, selectedIndex, pageMargin } = this.state;

    return (
      <View
        renderToHardwareTextureAndroid
        styleName="flexible"
        driver={this.timingDriver}
        animationName="lightsOff"
      >
        <HorizontalPager
          data={data}
          onIndexSelected={this.onIndexSelected}
          selectedIndex={selectedIndex}
          renderPage={this.renderPage}
          scrollEnabled={imageTransformed}
          bounces
          pageMargin={pageMargin}
          showNextPage={false}
        />
      </View>
    );
  }
}

const StyledImageGallery = connectStyle('shoutem.ui.ImageGallery', {})(ImageGallery);

export {
  StyledImageGallery as ImageGallery,
};
