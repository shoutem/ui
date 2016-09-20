import React, { Component } from 'react';
import { DriverShape, ScrollDriver } from '@shoutem/animation';

/**
 * Use this component if you want to share animation driver between unreachable siblings.
 * Just wrap their parent component with it. We use it to share an instance of ScrollDriver
 * between Screen and NavigationBar automatically. ScrollView from @shoutem/ui uses it to
 * register its driver.
 */
export class DriverPool extends Component {
  static childContextTypes = {
    pool: React.PropTypes.object,
    animationDriver: DriverShape,
  };

  static propTypes = {
    children: React.PropTypes.node,
    animationDriver: DriverShape,
  };

  constructor(props,context) {
    super(props, context);
    this.animationDriver = new ScrollDriver();
  }

  getChildContext() {
    return {
      pool: this,
      animationDriver: this.animationDriver,
    };
  }

  setAnimationDriver(driver, primaryScrollView) {
    if ((driver || !this.animationDriver) || primaryScrollView) {
      this.animationDriver = driver;
    }
  }

  render() {
    return this.props.children;
  }
}
