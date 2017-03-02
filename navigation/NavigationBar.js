import React, { Component } from 'react';
import _ from 'lodash';

import { NavigationBarView, NavigationBarStyleName } from './NavigationBarView';
import { DriverShape } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

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
     * If `true`, the navigation bar will not be rendered.
     */
    hidden: React.PropTypes.bool,
    /**
     * Use the child navigation bar instead, if `true`
     * the parent navigation bar will be hidden, and
     * the navigation bar props will be merged with the
     * props of the child navigation bar instead.
     */
    child: React.PropTypes.bool,
  };

  static contextTypes = {
    animationDriver: DriverShape,
    getScene: React.PropTypes.func.isRequired,
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
    const { getScene, clearNavBarProps } = this.context;
    const scene = getScene();
    clearNavBarProps(scene.route);
  }

  setNextNavBarProps(props) {
    const { getScene, animationDriver, setNextNavBarProps } = this.context;
    const scene = getScene();
    setNextNavBarProps(scene.route, {
      driver: animationDriver,
      ...props,
    });
  }

  render() {
    return null;
  }
}


/**
 * A ChildNavigationBar is component that can be used to override
 * the global NavigationBar props of child CardStack.
 * This component has no UI, it only servers as a
 * communication channel for dispatching props to the global navigation bar.
 * It is the same as NavigationBar component with an exception it has
 * child prop set to true and is not connected to theme
 */
class ChildNavigationBar extends NavigationBar {
  static defaultProps = {
    child: true,
  }
}

/**
 * @see {@link NavigationBarStyleName}
 * NavigationBarView style name is related to NavigationBar style name, it must be the same name.
 */
const StyledNavigationBar = connectStyle(NavigationBarStyleName)(NavigationBar);

export {
  ChildNavigationBar,
  StyledNavigationBar as NavigationBar,
};
