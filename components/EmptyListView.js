import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { connectStyle } from '@shoutem/theme';
import { Text, Title, View } from '@shoutem/ui';
import EmptyList from '../assets/images/emptyList.svg'

class EmptyListView extends PureComponent {
  static defaultProps = {
    title: "It's empty in here",
    message: "We couldn't find anything to show...",
  }

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  resolveImage() {
    const { image } = this.props;

    if (image && !_.isFunction(image)) {
      console.warn(`Image must be an SVG file imported as a React component.`);
    } else if (image && _.isFunction(image)) {
      return image;
    }

    return EmptyList;
  }

  render() {
    const { message, title, imageStyle, titleStyle, messageStyle } = this.props
    const EmptyStateImage = this.resolveImage();

    return (
      <View styleName="vertical h-center">
        <EmptyStateImage styleName='image' style={imageStyle} />
        <Title styleName="title" style={titleStyle}>{title}</Title>
        <Text styleName="description" style={messageStyle}>{message}</Text>
      </View >
    );
  }
}

EmptyListView.propTypes = {
  ...EmptyListView.propTypes,
  image: PropTypes.func,
  imageStyle: PropTypes.object,
  message: PropTypes.string,
  messageStyle: PropTypes.object,
  title: PropTypes.string,
  titleStyle: PropTypes.object,
};

const StyledView = connectStyle('shoutem.ui.EmptyListView')(EmptyListView);

export {
  StyledView as EmptyListView,
};
