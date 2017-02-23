import React, { Component } from 'react';

import { connectStyle } from '@shoutem/theme';
import { connectAnimation } from '@shoutem/animation';

import {
  View,
  Subtitle,
  Caption,
  Icon,
  TouchableOpacity,
  ScrollView,
} from './../index';

const DESCRIPTION_LENGTH_TRIM_LIMIT = 90;

/**
 * An overlay that is intended to be rendered above
 * images in a gallery. It can display a title and
 * a description of an image.
 */
class ImageGalleryOverlay extends Component {
  static propTypes = {
    title: React.PropTypes.string,
    description: React.PropTypes.string,
    style: React.PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.collapseDescription = this.collapseDescription.bind(this);
    this.expandDescription = this.expandDescription.bind(this);

    this.state = {
      isDescriptionCollapsed: true,
    };
  }

  collapseDescription() {
    this.setState({ isDescriptionCollapsed: false });
  }

  expandDescription() {
    this.setState({ isDescriptionCollapsed: true });
  }

  renderTitle(title) {
    const { style } = this.props;

    if (!title) {
      return null;
    }

    return (
      <View style={style.title.container}>
        <Subtitle style={style.title.text} numberOfLines={2}>{title}</Subtitle>
      </View>
    );
  }

  renderDescription(description) {
    const { style } = this.props;
    const collapsed = this.state.isDescriptionCollapsed;

    if (!description) {
      return null;
    }

    const descriptionIcon = (<Icon name={`${collapsed ? 'up' : 'down'}-arrow`} />);

    const descriptionText = (
      <Caption
        style={style.description.text}
        numberOfLines={collapsed ? 2 : null}
      >
        {description}
      </Caption>
    );

    return (
      <View
        styleName={collapsed ? 'collapsed' : 'expanded'}
        style={style.description.container}
      >
        <TouchableOpacity
          onPress={collapsed ? this.collapseDescription : this.expandDescription}
          hitSlop={{
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
          }}
        >
          {description.length >= DESCRIPTION_LENGTH_TRIM_LIMIT ? descriptionIcon : null}
        </TouchableOpacity>
        <ScrollView style={style.description.scroll}>
          {descriptionText}
        </ScrollView>
      </View>
    );
  }

  render() {
    const { title, description, style } = this.props;

    if (!title && !description) {
      return null;
    }

    return (
      <View style={style.container} pointerEvents="box-none">
        {this.renderTitle(title)}
        {this.renderDescription(description)}
      </View>
    );
  }
}

const AnimatedOverlay = connectAnimation(ImageGalleryOverlay);
const StyledOverlay = connectStyle('shoutem.ui.ImageGalleryOverlay', {
  container: {},
  title: {
    container: {},
    text: {},
  },
  description: {
    container: {},
    scroll: {},
    text: {},
  },
})(AnimatedOverlay);
export {
  StyledOverlay as ImageGalleryOverlay,
};
