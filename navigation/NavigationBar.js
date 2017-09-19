import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { DriverShape } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';
import { NavigationBarView, NavigationBarStyleName } from './NavigationBarView';

/**
 * A NavigationBar component that can be used to define
 * the global NavigationBar props. This component has no
 * UI, it only serves as a communication channel for
 * dispatching props to the global navigation bar.
 */
class NavigationBar extends Component {
  static View = NavigationBarView;

  static propTypes = {
    ...NavigationBarView.propTypes,
    /**
     * If `true`, the navigation bar will not be rendered.
     */
    hidden: PropTypes.bool,
    /**
     * Use the child navigation bar instead, if `true`
     * the parent navigation bar will be hidden, and
     * the navigation bar props will be merged with the
     * props of the child navigation bar instead.
     */
    child: PropTypes.bool,
  };

  static contextTypes = {
    animationDriver: DriverShape,
    getScene: PropTypes.func.isRequired,
    setNavBarProps: PropTypes.func.isRequired,
    clearNavBarProps: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.setNavBarProps(props);
  }

  componentWillReceiveProps(nextProps) {
    if (_.isEqual(nextProps, this.props)) {
      return;
    }

    this.setNavBarProps(nextProps);
  }

  componentWillUnmount() {
    // The parent screen is being unmounted, we can cleanup now
    const { getScene, clearNavBarProps } = this.context;
    const scene = getScene();
    clearNavBarProps(scene.route);
  }

  setNavBarProps(props) {
    const { getScene, animationDriver, setNavBarProps } = this.context;
    const scene = getScene();
    setNavBarProps(scene.route, {
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
 * This component has no UI, it only serves as a
 * communication channel for dispatching props to the global navigation bar.
 * It is the same as NavigationBar component with an exception it has
 * child prop set to true and is not connected to theme, because connectStyle
 * would always pass style prop to it and that would result NavigationBar having
 * wrong style.
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
