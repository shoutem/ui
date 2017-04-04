import React, { Component } from 'react';
import { Animated } from 'react-native';
import { connectStyle } from '@shoutem/theme';

import { ScrollDriver, DriverShape } from '@shoutem/animation';

import { ScrollDriverProvider } from './ScrollDriverProvider.js';

class ScrollView extends Component {
  static propTypes = {
    ...Animated.ScrollView.propTypes,
  };

  static contextTypes = {
    animationDriver: DriverShape,
    driverProvider: React.PropTypes.object,
  };

  static childContextTypes = {
    animationDriver: DriverShape,
  };

  static DriverProvider = ScrollDriverProvider;

  constructor(props, context) {
    super(props, context);
    this.animationDriver = props.driver || new ScrollDriver({ useNativeDriver: true });
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

  render() {
    const { props, animationDriver } = this;
    const { style = {} } = props;
    const contentContainerStyle = {
      ...style.contentContainerStyle,
    };
    delete style.contentContainerStyle;

    return (
      <Animated.ScrollView
        contentContainerStyle={contentContainerStyle}
        {...animationDriver.scrollViewProps}
        {...props}
      />
    );
  }
}

const StyledScrollView = connectStyle('shoutem.ui.ScrollView')(ScrollView);

export {
  StyledScrollView as ScrollView,
};
