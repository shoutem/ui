import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';
import { connectStyle } from '@shoutem/theme';
import _ from 'lodash';

import { ScrollDriver, DriverShape } from '@shoutem/animation';

import { ScrollDriverProvider } from './ScrollDriverProvider.js';

class ScrollView extends Component {
  static propTypes = {
    ...Animated.ScrollView.propTypes,
  };

  static contextTypes = {
    animationDriver: DriverShape,
    driverProvider: PropTypes.object,
  };

  static childContextTypes = {
    animationDriver: DriverShape,
  };

  static DriverProvider = ScrollDriverProvider;

  constructor(props, context) {
    super(props, context);
    this.animationDriver = props.driver || new ScrollDriver({ useNativeDriver: true });
    this.setWrappedInstance = this.setWrappedInstance.bind(this);
  }

  getChildContext() {
    return {
      animationDriver: this.animationDriver,
    };
  }

  componentWillMount() {
    const { driverProvider } = this.context;
    const { primary } = this.props;
    if (driverProvider) {
      driverProvider.setAnimationDriver(this.animationDriver, primary);
    }
  }

  componentWillReceiveProps(newProps, newContext) {
    if (newProps.driver && this.animationDriver !== newProps.driver) {
      this.animationDriver = newProps.driver;
    } else if (newContext.animationDriver && this.animationDriver !== newContext.animationDriver) {
      this.animationDriver = newContext.animationDriver;
    }
  }

  setWrappedInstance(component) {
    this.wrappedInstance = component;
  }

  render() {
    const { props, animationDriver } = this;
    const { style = {} } = props;
    const contentContainerStyle = {
      ...style.contentContainerStyle,
    };
    delete style.contentContainerStyle;

    return (
      <Animated.ScrollView
        ref={this.setWrappedInstance}
        contentContainerStyle={contentContainerStyle}
        {...animationDriver.scrollViewProps}
        {...props}
      />
    );
  }
}

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

export {
  StyledScrollView as ScrollView,
};
