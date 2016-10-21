import React, { Component } from 'react';
import _ from 'lodash';

import { NavigationBarView } from './NavigationBarView';
import { DriverShape } from '@shoutem/animation';

/**
 * A NavigationBar component that can be used to define
 * the global NavigationBar props. This component has no
 * UI, it only servers as a communication channel for
 * dispatching props to the global navigation bar.
 */
class NavigationBar extends Component {
  static View = NavigationBarView;

  static propTypes = {
    ...NavigationBarView.propTypes,
    /**
     * If true, the navigation bar will not be rendered.
     */
    hidden: React.PropTypes.bool,
  };

  static contextTypes = {
    animationDriver: DriverShape,
    scene: React.PropTypes.object.isRequired,
    setNextNavBarProps: React.PropTypes.func.isRequired,
    clearNavBarProps: React.PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.setNextNavBarProps(props);
  }

  componentWillReceiveProps(nextProps) {
    if (_.isEqual(nextProps, this.props)) {
      return;
    }

    this.setNextNavBarProps(nextProps);
  }

  componentWillUnmount() {
    // The parent screen is being unmounted, we can cleanup now
    const { scene, clearNavBarProps } = this.context;
    clearNavBarProps(scene.route);
  }

  setNextNavBarProps(props) {
    const { scene, animationDriver, setNextNavBarProps } = this.context;
    setNextNavBarProps(scene.route, {
      ...props,
      driver: animationDriver,
    });
  }

  render() {
    return null;
  }
}

export {
  NavigationBar,
};
