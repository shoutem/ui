import React, { Component } from 'react';
import { ScrollView as RNScrollView } from 'react-native';

import { ScrollDriver, DriverShape } from '@shoutem/animation';

import { connectStyle } from '@shoutem/theme';

import { ScrollDriverProvider } from './ScrollDriverProvider.js';

export class ScrollView extends Component {
  static propTypes = {
    ...RNScrollView.propTypes,
  }

  static contextTypes = {
    animationDriver: DriverShape,
    driverProvider: React.PropTypes.object,
  }

  static childContextTypes = {
    animationDriver: DriverShape,
  }

  static DriverProvider = ScrollDriverProvider;

  constructor(props, context) {
    super(props, context);
    this.animationDriver = props.driver || new ScrollDriver();
  }

  getChildContext() {
    return {
      animationDriver: this.animationDriver,
    };
  }

  componentWillMount() {
    const { driverProvider } = this.context;
    const { primary } = this.props
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
      <RNScrollView
        {...props}
        contentContainerStyle={contentContainerStyle}
        {...animationDriver.scrollViewProps}
      />
    );
  }
}

const StyledScrollView = connectStyle('shoutem.ui.ScrollView', ScrollView);
