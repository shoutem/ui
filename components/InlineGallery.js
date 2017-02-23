import React, { Component, PropTypes } from 'react';

import _ from 'lodash';
import { connectStyle } from '@shoutem/theme';

import { View } from './View';
import { TouchableOpacity } from './TouchableOpacity';
import { Image } from './Image';
import { HorizontalPager } from './HorizontalPager';
import { LoadingIndicator } from './LoadingIndicator';

class InlineGallery extends Component {
  static propTypes = {
    // Array containing objects with image data (shape defined below)
    data: PropTypes.arrayOf(
      PropTypes.shape({
        source: React.PropTypes.shape({
          uri: React.PropTypes.string,
        }),
      }),
    ).isRequired,
    // Callback function called when user taps on single item (image) in gallery
    onPress: PropTypes.func,
    // Callback function called when user swipes between pages (images)
    // Index of new (selected) page is passed to this callback
    onIndexSelected: PropTypes.func,
    // Initially selected page in gallery
    selectedIndex: PropTypes.number,
    // Style, applied to Image component
    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]),
    // Prop that reduces page size by pageMargin, allowing 'sneak peak' of next page
    // Defaults to false
    showNextPage: PropTypes.bool,
    // Callback function that can be used to render overlay over pages
    // For example page indicators using `PageIndicators` component
    // renderOverlay(selectedIndex, data)
    renderOverlay: PropTypes.func,
    // Callback function that can be used to define placeholder
    // that appears when content is loading
    renderPlaceholder: PropTypes.func,
  };

  static defaultProps = {
    renderPlaceholder: () => {
      return (
        <LoadingIndicator />
      );
    },
  }

  constructor(props) {
    super(props);
    this.renderPage = this.renderPage.bind(this);
    this.onPress = this.onPress.bind(this);
    this.onIndexSelected = this.onIndexSelected.bind(this);
    this.state = {
      selectedIndex: 0,
      showNextPage: this.props.showNextPage || false,
    };
  }

  onPress() {
    const { onPress } = this.props;

    return onPress && onPress();
  }

  onIndexSelected(newIndex) {
    const { selectedIndex } = this.state;
    const { onIndexSelected } = this.props;

    if (selectedIndex !== newIndex) {
      this.setState({ selectedIndex: newIndex });
      if (_.isFunction(onIndexSelected)) {
        onIndexSelected(newIndex);
      }
    }
  }

  getSelectedIndex() {
    const { selectedIndex } = this.state;

    return selectedIndex;
  }

  renderPage(page, id) {
    const { style, onPress } = this.props;
    const source = _.get(page, 'source.uri');

    if (!source) {
      return;
    }

    return (
      <TouchableOpacity
        onPress={this.onPress}
        key={id}
        styleName="flexible"
        style={style.imageContainer}
        disabled={!onPress}
      >
        <Image
          source={{ uri: source }}
          style={style.image}
          styleName="flexible"
        />
      </TouchableOpacity>
    );
  }

  render() {
    const { data, selectedIndex, renderOverlay, renderPlaceholder, style } = this.props;
    const { showNextPage } = this.state;

    return (
      <View
        renderToHardwareTextureAndroid
        style={style.container}
      >
        <HorizontalPager
          data={data}
          onIndexSelected={this.onIndexSelected}
          selectedIndex={selectedIndex}
          renderPage={this.renderPage}
          pageMargin={style.pager.pageMargin}
          showNextPage={showNextPage}
          renderOverlay={renderOverlay}
          renderPlaceholder={renderPlaceholder}
        />
      </View>
    );
  }
}

const StyledInlineGallery = connectStyle('shoutem.ui.InlineGallery')(InlineGallery);

export {
  StyledInlineGallery as InlineGallery,
};
