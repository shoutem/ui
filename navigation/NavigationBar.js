import React, { Component } from 'react';
import { NavigationBarView } from './NavigationBarView';

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
    setNextNavBarProps: React.PropTypes.func.isRequired,
    clearNavBarProps: React.PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    context.setNextNavBarProps(props);
  }

  componentWillReceiveProps(nextProps) {
    this.context.setNextNavBarProps(nextProps);
  }

  componentWillUnmount() {
    // The parent screen is being unmounted, we can cleanup now
    this.context.clearNavBarProps();
  }

  render() {
    return null;
  }
}

export {
  NavigationBar,
};
