import React, { Component } from 'react';
import _ from 'lodash';

import {
  StatusBar,
  Animated,
  NavigationExperimental,
} from 'react-native';

import { connectStyle } from '@shoutem/theme';
import { connectAnimation } from '@shoutem/animation';

import composeChildren from './composeChildren';

const {
  Header: NavigationHeader,
} = NavigationExperimental;

const navigationHeaderStyle = {
  backgroundColor: 'transparent',
  borderBottomColor: 'transparent',
  borderBottomWidth: 0,
};

/**
 * A root navigation bar component that needs to work with
 * the RootNavigationStack, and NavigationBar components.
 *
 * The RootNavigationStack serves as a mediator between
 * the screen and this component so that each screen can
 * define and update the navigation bar props in its render
 * method by rendering the NavigationBar virtual component.
 *
 * This allows us to add or remove navigation bar components
 * during the lifetime of a screen, instead of defining them
 * only before the screen is opened through route props.
 */
class NavigationBarView extends Component {
  static propTypes = {
    ...NavigationHeader.propTypes,
    /**
     * The title to display in the navigation bar.
     */
    title: React.PropTypes.string,
    /**
     * If this prop exists, and has a valid link,
     * a share control will be rendered as the right
     * component of the navigation bar.
     */
    share: React.PropTypes.shape({
      title: React.PropTypes.string,
      text: React.PropTypes.string,
      link: React.PropTypes.string,
    }),
    style: React.PropTypes.object,
  };

  static defaultProps = {
    // Clear the RN default render functions
    renderTitleComponent: () => null,
    renderLeftComponent: () => null,
    renderRightComponent: () => null,
  };

  static contextTypes = {
    resolveStyle: React.PropTypes.func.isRequired,
    getNextNavBarProps: React.PropTypes.func.isRequired,

    getRenderedNavBarProps: React.PropTypes.func.isRequired,
    setRenderedNavBarProps: React.PropTypes.func.isRequired,
  };

  /**
   * Gets the next navigation bar props for a given scene.
   *
   * @param scene The scene to get the props for.
   * @returns {*} The navigation bar props.
   */
  getNextNavBarProps(scene = {}) {
    return this.context.getNextNavBarProps(scene.route);
  }

  /**
   * Gets the current navigation bar props of the
   * already rendered scene.
   *
   * @param scene The scene to get the props for.
   * @returns {*} The navigation bar props.
   */
  getRenderedProps(scene = {}) {
    return this.context.getRenderedNavBarProps(scene.route);
  }

  /**
   * Gets the background navigation bar color for props.
   *
   * @param props The props to get the color from.
   * @returns {*} The background color.
   */
  getBackgroundColor(props) {
    const color = _.get(props, 'style.container.backgroundColor', 'black');

    // If this is an animated value, we want to convert it to
    // a plain object in order to get its current value.
    if (color.toJSON) {
      return color.toJSON();
    }

    return color;
  }

  /**
   * Manually resolves the next props. This function currently
   * only resolves the style by using the functions provided by
   * the parent StyledComponent.
   *
   * @param scene The scene to resolve the props for.
   * @returns {*} The resolved props.
   */
  resolveNextProps(scene) {
    const { resolveStyle } = this.context;

    const props = this.getNextNavBarProps(scene);
    const style = resolveStyle(props);
    return {
      ...props,
      style,
    };
  }

  /**
   * Creates the interpolated style in order to animate the
   * navigation bar transition between the current one, and
   * the surrounding scenes.
   * @returns {*} The animated style.
   */
  interpolateNavBarStyle() {
    const { position, scene, scenes } = this.props;
    const { index } = scene;

    const positionValue = position.toJSON();
    if (positionValue === index) {
      // We are not in a transition, do not override the
      // default style to allow any custom animations that
      // the screen may want to perform on the NavigationBar
      return {};
    }

    // Previous and/or next scenes should already be rendered, but
    // the current scene is probably being rendered now. We are using
    // the next props for the current scene, so that we immediately
    // start the animation with the final state of the navigation bar.
    // Without this, we may get delays in the navigation bar animations,
    // and various flickers on the screen.
    const previousProps = this.getRenderedProps(scenes[index - 1]);
    const currentProps = this.resolveNextProps(scene);
    const nextProps = this.getRenderedProps(scenes[index + 1]);

    const previousColor = this.getBackgroundColor(previousProps);
    const currentColor = this.getBackgroundColor(currentProps);
    const nextColor = this.getBackgroundColor(nextProps);

    return {
      backgroundColor: position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [previousColor, currentColor, nextColor],
        extrapolate: 'clamp',
      }),
    };
  }

  render() {
    const { style } = this.props;

    // Report our current props, so that next/previous scenes may
    // use them for their animations.
    this.context.setRenderedNavBarProps(this.props);

    return (
      <Animated.View style={[style.container, this.interpolateNavBarStyle()]}>
        <StatusBar translucent />
        <NavigationHeader
          {...this.props}
          style={navigationHeaderStyle}
        />
      </Animated.View>
    );
  }
}

const AnimatedNavigationBarView = connectAnimation(composeChildren(NavigationBarView), undefined, {
  createAnimatedComponent: false,
});
const StyledNavigationBarView = connectStyle('shoutem.ui.navigation.NavigationBar')(
  AnimatedNavigationBarView
);

export {
  StyledNavigationBarView as NavigationBarView,
};
