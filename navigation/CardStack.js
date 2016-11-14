import React, { Component } from 'react';
import { NavigationExperimental, InteractionManager } from 'react-native';

import {
  ScrollView,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import { SceneProvider } from './SceneProvider';

import { RNCardStack } from './RNCardStack';

export const VERSION_KEY = '.version';

/**
 * A card navigation stack. This component renders a navigation
 * bar and facilitates the communication between the navigation
 * bar view, and various application screens.
 */
class CardStack extends Component {
  static propTypes = {
    ...RNCardStack.propTypes,
    renderNavBar: React.PropTypes.func,
    style: React.PropTypes.shape({
      cardStack: RNCardStack.propTypes.style,
      card: React.PropTypes.any,
    }),
  };

  static contextTypes = {
    getNextNavBarProps: React.PropTypes.func,
    scene: React.PropTypes.object,
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
    this.refreshNavBar = this.refreshNavBar.bind(this);

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

    this.refreshNavBar();
  }

  getNextNavBarProps(route = {}) {
    let props = this.nextNavBarProps[route.key] || {};
    const { getNextNavBarProps, scene } = this.context;
    if (getNextNavBarProps && scene) {
      const parentProps = getNextNavBarProps(scene.route);
      if (parentProps.child) {
        delete parentProps.child;
        delete parentProps.driver;
        delete parentProps[VERSION_KEY];
        props = {
          ...props,
          ...parentProps,
        };
        delete props.child;
      }
    }

    return { ...props };
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

  refreshNavBar() {
    InteractionManager.runAfterInteractions(() => this.forceUpdate());
  }

  renderNavBar(props) {
    const { scene } = props;
    const nextProps = this.getNextNavBarProps(scene.route);

    const navBarProps = {
      ...props,
      ...nextProps,
    };

    if (navBarProps.hidden || navBarProps.child) {
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
    const style = this.props.style || {};

    return (
      <RNCardStack
        {...this.props}
        style={style.cardStack}
        cardStyle={style.card}
        renderHeader={this.renderNavBar}
        renderScene={this.renderScene}
        interpolateCardStyle={style.interpolateCardStyle}
      />
    );
  }
}

delete CardStack.propTypes.renderHeader;

const StyledCardStack = connectStyle('shoutem.ui.navigation.CardStack')(CardStack);
export {
  StyledCardStack as CardStack,
};
