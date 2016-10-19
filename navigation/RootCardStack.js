import React, { Component } from 'react';
import { NavigationExperimental } from 'react-native';

import {
  ScrollView,
} from '@shoutem/ui';

const {
  CardStack: NavigationCardStack,
} = NavigationExperimental;

/**
 * A root navigation stack. This component renders a global
 * navigation bar and facilitates the communication between
 * the navigation bar view, and various application screens.
 */
export class RootCardStack extends Component {
  static propTypes = {
    ...NavigationCardStack.propTypes,
    renderNavBar: React.PropTypes.func,
  };

  static childContextTypes = {
    setNextNavBarProps: React.PropTypes.func,
    getNextNavBarProps: React.PropTypes.func,
    clearNavBarProps: React.PropTypes.func,

    setRenderedNavBarProps: React.PropTypes.func,
    getRenderedNavBarProps: React.PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.renderNavBar = this.renderNavBar.bind(this);

    /**
     * A map where the key is the route key, and the value is
     * the navigation bar props object for that route. Next
     * navigation bar props represent the navigation bar props that
     * will be rendered during the next render cycle.
     */
    this.nextNavBarProps = {};
    /**
     * A map of the rendered navigation bar props organized in the
     * same way as the nextNavBarProps above. This map represents
     * the props that were last rendered for a given route.
     */
    this.renderedNavBarProps = {};
  }

  getChildContext() {
    const currentRoute = this.getCurrentRoute();

    return {
      getNextNavBarProps: (route) => this.getNextNavBarProps(route),
      setNextNavBarProps: (navBarProps) => this.setNextNavBarProps(currentRoute, navBarProps),
      clearNavBarProps: () => this.clearNavBarProps(currentRoute),

      getRenderedNavBarProps: (route) => this.getRenderedNavBarProps(route),
      setRenderedNavBarProps: (navBarProps) =>
        this.setRenderedNavBarProps(currentRoute, navBarProps),
    };
  }

  getCurrentRoute() {
    const { routes, index } = this.props.navigationState;
    if (!routes) {
      return undefined;
    }

    return routes[index];
  }

  setNextNavBarProps(route = {}, props) {
    const key = route.key;
    const currentProps = this.getNextNavBarProps(route);

    // Merge the props, so that we may set them partially
    // in cases when there are multiple screens in the hierarchy.
    this.nextNavBarProps[key] = {
      ...currentProps,
      ...props,
    };
  }

  getNextNavBarProps(route = {}) {
    const props = this.nextNavBarProps[route.key] || {};
    return props;
  }

  setRenderedNavBarProps(route = {}, props) {
    this.renderedNavBarProps[route.key] = props;
  }

  getRenderedNavBarProps(route = {}) {
    const props = this.renderedNavBarProps[route.key] || {};
    return props;
  }

  clearNavBarProps(route = {}) {
    const key = route.key;
    delete this.nextNavBarProps[key];
    delete this.renderedNavBarProps[key];
  }

  renderNavBar(props) {
    const { scene } = props;
    const nextProps = this.getNextNavBarProps(scene.route);

    const navBarProps = {
      ...props,
      ...nextProps,
    };

    if (navBarProps.hidden) {
      return null;
    }

    return this.props.renderNavBar(navBarProps);
  }

  render() {
    return (
      <ScrollView.DriverProvider>
        <NavigationCardStack
          {...this.props}
          renderHeader={this.renderNavBar}
          renderScene={this.props.renderScene}
        />
      </ScrollView.DriverProvider>
    );
  }
}

delete RootCardStack.propTypes.renderHeader;
