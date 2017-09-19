import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { DriverShape, ScrollDriver } from '@shoutem/animation';
import * as _ from 'lodash';
/**
 * Use this component if you want to share animation driver between unreachable siblings.
 * Just wrap their parent component with it. We use it to share an instance of ScrollDriver
 * between Screen and NavigationBar automatically. ScrollView from @shoutem/ui uses it to
 * register its driver.
 */
export class ScrollDriverProvider extends Component {
  static childContextTypes = {
    driverProvider: PropTypes.object,
    animationDriver: DriverShape,
  };

  static contextTypes = {
    animationDriver: DriverShape,
  };

  static propTypes = {
    children: PropTypes.node,
    driver: DriverShape,
  };

  constructor(props, context) {
    super(props, context);
    this.setupAnimationDriver(props, context);
  }

  getChildContext() {
    return {
      driverProvider: this,
      animationDriver: this.animationDriver,
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setupAnimationDriver(nextProps, nextContext);
  }

  setupAnimationDriver(props, context) {
    if (props.driver) {
      this.animationDriver = props.driver;
    } else if (context.driverProvider) {
      this.animationDriver = context.animationDriver;
    } else if (!this.animationDriver) {
      this.animationDriver = new ScrollDriver({ useNativeDriver: true });
    }
  }

  setAnimationDriver(driver, primaryScrollView) {
    if ((driver || !this.animationDriver) || primaryScrollView) {
      _.assign(this.animationDriver, driver);
      const { driverProvider } = this.context;
      if (driverProvider) {
        driverProvider.setAnimationDriver(driver, primaryScrollView);
      }
    }
  }

  render() {
    const { children } = this.props;
    return children && Children.only(this.props.children);
  }
}
