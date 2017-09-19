import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  InteractionManager,
} from 'react-native';

import _ from 'lodash';

import {
  ScrollView,
  View,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import { SceneProvider } from './SceneProvider';

import { RNCardStack } from './RNCardStack';

/**
 * A card navigation stack. This component renders a navigation
 * bar and facilitates the communication between the navigation
 * bar view, and various application screens.
 */
class CardStack extends PureComponent {
  static propTypes = {
    ...RNCardStack.propTypes,
    renderNavBar: PropTypes.func,
    // Controls whether native animation driver will be used
    // for screen transitions or not.
    useNativeAnimations: PropTypes.bool,
    // Controls whether the navigation bar should be rendered,
    // together with the screen, or should it be global for the
    // entire app.
    inlineNavigationBar: PropTypes.bool,
    style: PropTypes.shape({
      cardStack: RNCardStack.propTypes.style,
      card: PropTypes.any,
    }),
  };

  static defaultProps = {
    useNativeAnimations: true,
    inlineNavigationBar: true,
  };

  static contextTypes = {
    getNavBarProps: PropTypes.func,
    getScene: PropTypes.func,
  };

  static childContextTypes = {
    setNavBarProps: PropTypes.func,
    getNavBarProps: PropTypes.func,
    clearNavBarProps: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.renderNavBar = this.renderNavBar.bind(this);
    this.renderScene = this.renderScene.bind(this);
    this.getNavBarProps = this.getNavBarProps.bind(this);
    this.setNavBarProps = this.setNavBarProps.bind(this);
    this.clearNavBarProps = this.clearNavBarProps.bind(this);
    this.refreshNavBar = this.refreshNavBar.bind(this);

    /**
     * A map where the key is the route key, and the value is
     * the navigation bar props object for that route.
     */
    this.navBarProps = {};
  }

  getChildContext() {
    return {
      getNavBarProps: this.getNavBarProps,
      setNavBarProps: this.setNavBarProps,
      clearNavBarProps: this.clearNavBarProps,
    };
  }

  setNavBarProps(route = {}, props) {
    const key = route.key;
    const currentProps = this.getNavBarProps(route);

    // Merge the props, so that we may set them partially
    // in cases when there are multiple screens in the hierarchy.
    this.navBarProps[key] = {
      ...currentProps,
      ...props,
    };

    this.refreshNavBar();
  }

  getNavBarProps(route = {}) {
    let props = this.navBarProps[route.key] || {};
    const { getNavBarProps, getScene } = this.context;
    if (getNavBarProps && getScene) {
      const scene = getScene();
      const parentProps = getNavBarProps(scene.route);
      if (parentProps.child) {
        delete parentProps.child;
        delete parentProps.driver;
        props = _.merge({}, props, parentProps);
        delete props.child;
      }
    }

    const { useNativeAnimations, inlineNavigationBar } = this.props;
    return {
      ...props,
      useNativeAnimations,
      inline: inlineNavigationBar,
    };
  }

  clearNavBarProps(route = {}) {
    const key = route.key;
    delete this.navBarProps[key];
  }

  refreshNavBar() {
    if (this.props.useNativeAnimations) {
      requestAnimationFrame(() => this.forceUpdate());
    } else {
      InteractionManager.runAfterInteractions(() => this.forceUpdate());
    }
  }

  renderNavBar(props) {
    const { scene } = props;
    const nextProps = this.getNavBarProps(scene.route);

    const navBarProps = {
      ...props,
      ...nextProps,
    };

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
    const scene = (
      <ScrollView.DriverProvider>
        <SceneProvider scene={props.scene}>
          {this.props.renderScene(props)}
        </SceneProvider>
      </ScrollView.DriverProvider>
    );

    const style = this.props.style || {};
    const { inlineNavigationBar } = this.props;
    return inlineNavigationBar ? (
      <View style={style.sceneContainer}>
        {scene}
        {this.renderNavBar(props)}
      </View>
    ) : scene;
  }

  render() {
    const style = this.props.style || {};
    const { inlineNavigationBar } = this.props;

    // NOTE: explicitly providing enableGestures in props may
    // override the value of the useNativeAnimations prop, because
    // the native animations are currently controlled through the
    // enableGestures prop in RN CardStack.
    return (
      <RNCardStack
        enableGestures={!this.props.useNativeAnimations}
        {...this.props}
        style={style.cardStack}
        cardStyle={style.card}
        renderHeader={inlineNavigationBar ? null : this.renderNavBar}
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
