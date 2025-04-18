import React, { PureComponent } from 'react';
import { Animated } from 'react-native';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { ScrollDriver } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';
import {
  ScrollDriverContext,
  ScrollDriverProvider,
} from './ScrollDriverProvider.js';

class ScrollView extends PureComponent {
  static DriverProvider = ScrollDriverProvider;

  static DriverContext = ScrollDriverContext;

  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    this.animationDriver =
      props.driver ||
      new ScrollDriver(
        { useNativeDriver: true, nativeScrollEventThrottle: 20 },
        props.onScroll,
      );
  }

  componentDidMount() {
    const { driverProvider } = this.context;
    const { primary } = this.props;

    if (driverProvider) {
      driverProvider.setAnimationDriver(this.animationDriver, primary);
    }
  }

  componentDidUpdate() {
    const { driver } = this.props;

    if (driver && this.animationDriver !== driver) {
      this.animationDriver = driver;
    }
  }

  setWrappedInstance(component) {
    this.wrappedInstance = component;
  }

  render() {
    const { style, ...otherProps } = this.props;
    const { driverProvider } = this.context;
    const { scrollViewProps } = this.animationDriver;
    const { contentContainerStyle, ...otherStyle } = style;

    return (
      <ScrollDriverContext.Provider
        value={{
          driverProvider,
          animationDriver: this.animationDriver,
        }}
      >
        <Animated.ScrollView
          ref={this.setWrappedInstance}
          contentContainerStyle={contentContainerStyle}
          {...scrollViewProps}
          {..._.omit(otherProps, 'onScroll')}
          style={otherStyle}
        />
      </ScrollDriverContext.Provider>
    );
  }
}

ScrollView.contextType = ScrollDriverContext;

ScrollView.propTypes = {
  ...Animated.ScrollView.propTypes,
  primary: PropTypes.bool,
};

ScrollView.defaultProps = {
  primary: false,
};

const StyledScrollView = connectStyle('shoutem.ui.ScrollView')(ScrollView);

function getRNScrollViewComponent(context) {
  // wrappedInstance.wrappedInstance._component:
  //   1st wrappedInstance -> StyledScrollView
  //   2nd wrappedInstance -> ScrollView (Shoutem UI)
  //   _component -> Animated.ScrollView
  // more info about _component: https://stackoverflow.com/questions/42051368/scrollto-is-undefined-on-animated-scrollview
  return _.get(context, 'wrappedInstance.wrappedInstance._component');
}

StyledScrollView.prototype.scrollTo = function scrollTo(coordinates) {
  const scrollView = getRNScrollViewComponent(this);
  if (scrollView) {
    scrollView.scrollTo(coordinates);
  }
};

StyledScrollView.prototype.scrollToEnd = function scrollToEnd(animation) {
  const scrollView = getRNScrollViewComponent(this);
  if (scrollView) {
    scrollView.scrollToEnd(animation);
  }
};

export { StyledScrollView as ScrollView };
