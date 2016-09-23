import React, { Component } from 'react';
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
    driverProvider: React.PropTypes.object,
    animationDriver: DriverShape,
  };

  static contextTypes = {
    driverProvider: React.PropTypes.object,
  };

  static propTypes = {
    children: React.PropTypes.node,
    animationDriver: DriverShape,
  };

  constructor(props,context) {
    super(props, context);
    this.animationDriver = context.driverProvider ?
      context.driverProvider.animationDriver : new ScrollDriver();
  }

  getChildContext() {
    return {
      driverProvider: this,
      animationDriver: this.animationDriver,
    };
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
    return this.props.children;
  }
}
