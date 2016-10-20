import React, { Component } from 'react';
import { NavigationExperimental } from 'react-native';

import {
  ScrollView,
} from '@shoutem/ui';

import { SceneProvider } from './SceneProvider';

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

    scene: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.renderNavBar = this.renderNavBar.bind(this);
    this.renderScene = this.renderScene.bind(this);
    this.getNextNavBarProps = this.getNextNavBarProps.bind(this);
    this.setNextNavBarProps = this.setNextNavBarProps.bind(this);
    this.clearNavBarProps = this.clearNavBarProps.bind(this);
    this.getRenderedNavBarProps = this.getRenderedNavBarProps.bind(this);
    this.setRenderedNavBarProps = this.setRenderedNavBarProps.bind(this);

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
    return {
      getNextNavBarProps: this.getNextNavBarProps,
      setNextNavBarProps: this.setNextNavBarProps,
      clearNavBarProps: this.clearNavBarProps,

      getRenderedNavBarProps: this.getRenderedNavBarProps,
      setRenderedNavBarProps: this.setRenderedNavBarProps,
    };
  }

  setNextNavBarProps(route = {}, props) {
    const VERSION_KEY = '.version';

    const key = route.key;
    const currentProps = this.getNextNavBarProps(route);
    const version = currentProps[VERSION_KEY] || 0;

    // Merge the props, so that we may set them partially
    // in cases when there are multiple screens in the hierarchy.
    this.nextNavBarProps[key] = {
      ...currentProps,
      ...props,
      [VERSION_KEY]: version + 1,
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

    // Expose the animation driver to child components of the
    // navigation bar, so that we can animate them without
    // explicitly passing the driver to each component.
    return (
      <ScrollView.DriverProvider driver={navBarProps.driver}>
        {this.props.renderNavBar(navBarProps)}
      </ScrollView.DriverProvider>
    );
  }

  renderScene(props) {
    // DriverProvider provides the animation driver from the
    // primary scroll component of the screen to all other
    // screen children. The scene provider provides the current
    // navigation scene to child components through the context.
    return (
      <ScrollView.DriverProvider>
        <SceneProvider scene={props.scene}>
          {this.props.renderScene(props)}
        </SceneProvider>
      </ScrollView.DriverProvider>
    );
  }

  render() {
    return (
      <NavigationCardStack
        {...this.props}
        renderHeader={this.renderNavBar}
        renderScene={this.renderScene}
      />
    );
  }
}

delete RootCardStack.propTypes.renderHeader;
