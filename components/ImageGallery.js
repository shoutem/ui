import React, { Component, PropTypes } from 'react';

import {
  ScrollView,
  LayoutAnimation,
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
import { Image as SEImage } from './Image';

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
    // Prop that forces interactive (full screen) mode (black background)
    forceInteractiveMode: PropTypes.bool,
    // onModeChanged, callback function triggered when user taps on single photo
    // Or when user transforms (zooms etc), image
    // Triggered only if forceInteractiveMode is false.
    // Useful for hiding external controls (ie navigation bar)
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
    this.resetCurrentImageTransform = this.resetCurrentImageTransform.bind(this);
    this.resetHistoryImageTransform = this.resetHistoryImageTransform.bind(this);
    this.getImageTransformer = this.getImageTransformer.bind(this);
    this.checkCurrentZoomingSpace = this.checkCurrentZoomingSpace.bind(this);
    this.state = {
      selectedIndex: this.props.selectedIndex || 0,
      collapsed: true,
      hideAllControls: this.props.forceInteractiveMode || false,
      scrollEnabled: true,
      pageMargin: this.props.pageMargin || 0,
    };
  }

  componentWillMount() {
    const { forceInteractiveMode } = this.props;
    if (forceInteractiveMode) {
      this.timingDriver.runTimer(1);
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

  checkCurrentZoomingSpace() {
    const { scrollEnabled, selectedIndex } = this.state;
    const transformer = this.getImageTransformer(selectedIndex);

    if (transformer) {
      const space = transformer.getAvailableTranslateSpace();

      if (space && (space.right > 0 && space.left > 0) && scrollEnabled) {
        this.setState({ scrollEnabled: false });
      }

      if (space && (space.right <= 0 || space.left <= 0) && !scrollEnabled) {
        this.setState({ scrollEnabled: true });
      }
    }
  }

  onViewTransformed(event) {
    const { hideAllControls } = this.state;
    const { onModeChanged } = this.props;

    if (event.scale > 1.0 && !hideAllControls) {
      if (_.isFunction(onModeChanged)) {
        onModeChanged(true);
      }
      this.timingDriver.runTimer(1);
      this.setState({ hideAllControls: true });
    } else if (hideAllControls) {
      this.checkCurrentZoomingSpace();
    }
  }

  onSingleTapConfirmed() {
    const { hideAllControls } = this.state;
    const { onModeChanged, forceInteractiveMode } = this.props;

    if (!forceInteractiveMode) {
      if (hideAllControls) {
        this.timingDriver.runTimer(0, () => {
          if (_.isFunction(onModeChanged)) {
            onModeChanged(false);
          }
        });
        this.resetCurrentImageTransform();
      } else {
        if (_.isFunction(onModeChanged)) {
          onModeChanged(true);
        }
        this.timingDriver.runTimer(1);
      }

      this.setState({
        hideAllControls: !hideAllControls,
        scrollEnabled: true,
      });
    }
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
          {description.length >= 90 ? descriptionIcon : null}
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

  resetCurrentImageTransform() {
    const { selectedIndex } = this.state;
    const transformer = this.getImageTransformer(selectedIndex);
    if (transformer) {
      transformer.updateTransform({ scale: 1, translateX: 0, translateY: 0 });
    }
  }

  resetHistoryImageTransform() {
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
    const { scrollEnabled } = this.state;
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
          enableTranslate={!scrollEnabled}
          ref={((ref) => { this.imageRefs.set(pageId, ref); })}
        />
        { this.renderTitle(title) }
        { this.renderDescription(description) }
      </View>
    );
  }

  render() {
    const { data, style } = this.props;
    const { scrollEnabled, selectedIndex, pageMargin } = this.state;

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
          scrollEnabled={scrollEnabled}
          onFullPageSelected={this.resetHistoryImageTransform}
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
