import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text, Title, View } from '@shoutem/ui';
import EmptyList from '../assets/images/emptyList.svg';

class EmptyListImage extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  resolveImage() {
    const { image } = this.props;

    if (image && !_.isFunction(image)) {
      // eslint-disable-next-line no-console
      console.warn(`Image must be an SVG file imported as a React component.`);
    } else if (image && _.isFunction(image)) {
      return image;
    }

    return EmptyList;
  }

  render() {
    const {
      message,
      title,
      imageStyle,
      titleStyle,
      messageStyle,
      style,
    } = this.props;
    const EmptyStateImage = this.resolveImage();

    return (
      <View styleName="vertical h-center ">
        <EmptyStateImage style={[style.image, imageStyle]} />
        <Title styleName="title" style={[style.title, titleStyle]}>
          {title}
        </Title>
        <Text styleName="description" style={[style.message, messageStyle]}>
          {message}
        </Text>
      </View>
    );
  }
}

EmptyListImage.propTypes = {
  image: PropTypes.func,
  imageStyle: PropTypes.object,
  message: PropTypes.string,
  messageStyle: PropTypes.object,
  title: PropTypes.string,
  titleStyle: PropTypes.object,
};

EmptyListImage.defaultProps = {
  image: undefined,
  imageStyle: undefined,
  message: "We couldn't find anything to show...",
  messageStyle: undefined,
  title: "It's empty in here",
  titleStyle: undefined,
};

const StyledView = connectStyle('shoutem.ui.EmptyListImage')(EmptyListImage);

export { StyledView as EmptyListImage };
