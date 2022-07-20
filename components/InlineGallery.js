import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { HorizontalPager } from './HorizontalPager/HorizontalPager';
import { Image } from './Image';
import { LoadingIndicator } from './LoadingIndicator';
import { TouchableOpacity } from './TouchableOpacity';
import { View } from './View';

class InlineGallery extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    const { showNextPage } = props;

    this.state = {
      selectedIndex: 0,
      showNextPage,
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

  renderPage(pageData, pageIndex) {
    const { style, onPress } = this.props;
    const source = _.get(pageData, 'source.uri');

    if (!source) {
      return null;
    }

    return (
      <TouchableOpacity
        onPress={this.onPress}
        key={pageIndex}
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
    const {
      data,
      selectedIndex,
      renderOverlay,
      renderPlaceholder,
      style,
    } = this.props;
    const { showNextPage } = this.state;

    return (
      <View renderToHardwareTextureAndroid style={style.container}>
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

InlineGallery.propTypes = {
  // Array containing objects with image data (shape defined below)
  data: PropTypes.arrayOf(
    PropTypes.shape({
      source: PropTypes.shape({
        uri: PropTypes.string,
      }),
    }),
  ).isRequired,
  // Style, applied to Image component
  style: PropTypes.object.isRequired,
  // Callback function that can be used to render overlay over pages
  // For example page indicators using `PageIndicators` component
  // renderOverlay(imageData, imageIndex)
  renderOverlay: PropTypes.func,
  // Callback function that can be used to define placeholder
  // that appears when content is loading
  renderPlaceholder: PropTypes.func,
  // Initially selected page in gallery
  selectedIndex: PropTypes.number,
  // Prop that reduces page size by pageMargin, allowing 'sneak peak' of next page
  // Defaults to false
  showNextPage: PropTypes.bool,
  // Callback function called when user swipes between pages (images)
  // Index of new (selected) page is passed to this callback
  onIndexSelected: PropTypes.func,
  // Callback function called when user taps on single item (image) in gallery
  onPress: PropTypes.func,
};

InlineGallery.defaultProps = {
  renderPlaceholder: () => <LoadingIndicator />,
  renderOverlay: undefined,
  selectedIndex: undefined,
  showNextPage: false,
  onIndexSelected: undefined,
  onPress: undefined,
};

const StyledInlineGallery = connectStyle('shoutem.ui.InlineGallery')(
  InlineGallery,
);

export { StyledInlineGallery as InlineGallery };
