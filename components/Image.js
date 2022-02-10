import React, { PureComponent } from 'react';
import { Image as RNImage, Platform } from 'react-native';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

const fallbackImage = require('../assets/images/transparent.png');

// A valid source is either an object with an uri key or a number (from a `require` call)
const isValidSource = source =>
  _.isNumber(source) || (_.isObject(source) && source.uri);

/**
 * A function to transform props that will be used by
 * all instances of the Image component.
 */
let externalPropsTransformer = null;

class Image extends PureComponent {
  static propTypes = {
    ...RNImage.propTypes,
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

    autoBindReact(this);
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
      transformedProps.source = defaultSource || fallbackImage;
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
    return <RNImage {...this.createTransformedProps(this.props)} />;
  }
}

const AnimatedImage = connectAnimation(Image);
const StyledImage = connectStyle('shoutem.ui.Image')(AnimatedImage);
export { StyledImage as Image };
