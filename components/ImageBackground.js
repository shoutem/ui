import React, { PureComponent } from 'react';
import {
  ImageBackground as RNImageBackground,
  Platform,
} from 'react-native';
import _ from 'lodash';

import { connectStyle } from '@shoutem/theme';
import { connectAnimation } from '@shoutem/animation';

// A valid source is either an object with an uri key or a number (from a `require` call)
const isValidSource = (source) => _.isNumber(source) || (_.isObject(source) && source.uri);

/**
 * A function to transform props that will be used by
 * all instances of the Image component.
 */
let externalPropsTransformer = null;

class ImageBackground extends PureComponent {
  static propTypes = {
    ...RNImageBackground.propTypes,
  };

  /**
   * Set a shared props transformer. The transformer will
   * be called on each props change, and it should return
   * the transformed props.
   *
   * @param {function(props)} transformer The props transformer.
   */
  static setPropsTransformer(transformer) {
    externalPropsTransformer = transformer;
  }

  /**
   * Gets the shared props transformer. This can be useful in
   * cases when you wish to register a new transformer and
   * preserve the existing one.
   * @returns {*} The currently registered props transformer.
   */
  static getPropsTransformer() {
    return externalPropsTransformer;
  }

  constructor(props) {
    super(props);

    this.captureNativeComponentRef = this.captureNativeComponentRef.bind(this);
    this.state = {
      transformedProps: this.createTransformedProps(props),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      this.setState({
        transformedProps: this.createTransformedProps(nextProps),
      });
    }
  }

  setNativeProps(nativeProps) {
    this.nativeComponent.setNativeProps(nativeProps);
  }

  createTransformedProps(props) {
    let transformedProps = { ...props };
    const { source, defaultSource } = props;

    // defaultSource is not supported on Android, so we manually
    // reassign the defaultSource prop to source if source is not defined
    if (Platform.OS === 'android' && !isValidSource(source)) {
      // Image views are not rendered on Android if there is no image to display,
      // so we fallback to a transparent image to be compatible with iOS
      transformedProps.source = defaultSource || require('../assets/images/transparent.png');
      // Fixes a bug with local image resizing on Android:
      // https://github.com/facebook/react-native/issues/4598#issuecomment-162328501
      transformedProps.style = { width: null, height: null, ...props.style };
    }

    transformedProps.ref = this.captureNativeComponentRef;
    if (externalPropsTransformer) {
      transformedProps = externalPropsTransformer(transformedProps);
    }

    return transformedProps;
  }

  captureNativeComponentRef(component) {
    this.nativeComponent = component;
  }

  render() {
    const { transformedProps } = this.state;

    return (
      <RNImageBackground {...transformedProps} />
    );
  }
}

const AnimatedImage = connectAnimation(ImageBackground);
// We use identical styling to the Image component
const StyledImage = connectStyle('shoutem.ui.ImageBackground')(AnimatedImage);
export {
  StyledImage as ImageBackground,
};
