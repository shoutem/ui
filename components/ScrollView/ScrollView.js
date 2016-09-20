import React, { Component } from 'react';
import { ScrollView as RNScrollView } from 'react-native';

import { ScrollDriver, DriverShape } from '@shoutem/animation';

import { connectStyle } from '@shoutem/theme';

import { DriverPool } from './DriverPool.js';

export class ScrollView extends Component {
  static propTypes = {
    ...RNScrollView.propTypes,
  }

  static contextTypes = {
    animationDriver: DriverShape,
    pool: React.PropTypes.object,
  }

  static childContextTypes = {
    animationDriver: DriverShape,
  }

  static DriverPool = DriverPool;

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
    const { pool } = this.context;
    const { primary } = this.props
    if (pool) {
      pool.setAnimationDriver(this.animationDriver, primary);
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
