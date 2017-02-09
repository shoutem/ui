import React, { Component } from 'react';
import {
  Image as RNImage,
  Platform,
} from 'react-native';
import _ from 'lodash';

import { connectStyle } from '@shoutem/theme';
import { connectAnimation } from '@shoutem/animation';

// a valid source is either an object with an uri key or a number (from a `require` call)
const isValidSource = (source) => _.isNumber(source) || (_.isObject(source) && source.uri)

class Image extends Component {
  static propTypes = {
    ...RNImage.propTypes,
  }

  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }

  render() {
    const { props } = this;
    let resolvedProps = props;
    const { source, defaultSource } = props;

    // defaultSource is not supported on Android, so we manually
    // reassign the defaultSource prop to source if source is not defined
    if (Platform.OS === 'android' && !isValidSource(source)) {
      resolvedProps = {
        ...props,
        // Image views are not rendered on Android if there is no image to display,
        // so we fallback to a transparent image to be compatible with iOS
        source: defaultSource || require('../assets/images/transparent.png'),
        // Fixes a bug with local image resizing on Android:
        // https://github.com/facebook/react-native/issues/4598#issuecomment-162328501
        style: { width: null, height: null, ...props.style },
      };
    }

    return (
      <RNImage {...resolvedProps} ref={component => this._root = component} />
    );
  }
}

const AnimatedImage = connectAnimation(Image);
const StyledImage = connectStyle('shoutem.ui.Image')(AnimatedImage);
export {
  StyledImage as Image,
};
