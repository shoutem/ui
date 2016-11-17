import React, { Component } from 'react';
import {
  Image as RNImage,
  Platform,
  View as RNView,
} from 'react-native';
import _ from 'lodash';

import { connectStyle } from '@shoutem/theme';
import {
  connectAnimation,
  FadeIn,
  TimingDriver,
} from '@shoutem/animation';


// a valid source is either an object with an uri key or a number (from a `require` call)
const isValidSource = (source) => _.isNumber(source) || (_.isObject(source) && source.uri);

class Image extends Component {
  static propTypes = {
    ...RNImage.propTypes,
  };

  constructor(props, context) {
    super(props, context);

    this.handleLoad = this.handleLoad.bind(this);
    this.captureNativeComponentRef = this.captureNativeComponentRef.bind(this);
  }

  captureNativeComponentRef(component) {
    this.nativeComponent = component;
  }

  setNativeProps(nativeProps) {
    this.nativeComponent.setNativeProps(nativeProps);
  }

  handleLoad() {
    if (this.props.onLoad) {
      this.props.onLoad();
    }

    this.driver.runTimer(1);
  }

  componentWillMount() {
    this.driver = new TimingDriver();
  }

  resolveImageProps() {
    const { props } = this;
    const { source, defaultSource } = props;
    let resolvedProps = {...props};

    /**
     * The children will be rendered absolutely in a different container,
     * so that they are visible while the image is loading. We need to clear
     * them from the `Image` props here so that they are not rendered within
     * the `Image` component as well.
     */
    resolvedProps.children = null;

    // defaultSource is not supported on Android, so we manually
    // reassign the defaultSource prop to source if source is not defined
    if (Platform.OS === 'android' && !isValidSource(source)) {
      // Image views are not rendered on Android if there is no image to display,
      // so we fallback to a transparent image to be compatible with iOS
      resolvedProps.source = defaultSource || require('../assets/images/transparent.png');
      // Fixes a bug with local image resizing on Android:
      // https://github.com/facebook/react-native/issues/4598#issuecomment-162328501
      resolvedProps.style = { ...props.style, width: null };
    }
    return resolvedProps;
  }

  /**
   * Render children absolutely so they are visible
   * while waiting for image to be completely loaded.
   * @param children
   * @returns {JSX}
   */
  renderChildren(children) {
    return (
      <RNView
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      >
        {children}
      </RNView>
    );
  }

  render() {
    const imageProps = this.resolveImageProps();

    return (
      <RNView>
        <FadeIn driver={this.driver}>
          <RNImage
            {...imageProps}
            onLoad={this.handleLoad}
            ref={this.captureNativeComponentRef}
          />
        </FadeIn>
        {this.renderChildren(this.props.children)}
      </RNView>
    );
  }
}

const AnimatedImage = connectAnimation(Image);
const StyledImage = connectStyle('shoutem.ui.Image')(AnimatedImage);
export {
  StyledImage as Image,
};
