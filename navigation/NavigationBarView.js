import React, { Component } from 'react';
import _ from 'lodash';
import tinyColor from 'tinycolor2';

import {
  Platform,
  StatusBar,
  Animated,
  NavigationExperimental,
} from 'react-native';

import { connectStyle } from '@shoutem/theme';
import {
  connectAnimation,
  isAnimatedStyleValue,
  getAnimatedStyleValue,
  addAnimatedValueListener,
  removeAnimatedValueListener,
} from '@shoutem/animation';

import composeChildren from './composeChildren';

const {
  Header: NavigationHeader,
} = NavigationExperimental;

const navigationHeaderStyle = {
  backgroundColor: 'transparent',
  borderBottomColor: 'transparent',
  borderBottomWidth: 0,
};

/** @constant string NavigationBarStyleName
 * Both NavigationBar and NavigationBarView are connected to style with same name because
 * they represent same component. If NavigationBar is not connected to style then it can not be
 * customized on the screen. Further more, if NavigationBarView is not connected to style then
 * navigation bar does not have default style when not NavigationBar not passed to the screen.
 * On the end we want to style a same component with same name in the theme no matter on
 * internal implementation.
 */
export const NavigationBarStyleName = 'shoutem.ui.navigation.NavigationBar';

/**
 * A navigation bar component that work together with
 * the CardStack, and NavigationBar components.
 *
 * The CardStack serves as a mediator between the screen
 * and this component so that each screen can define and
 * update the navigation bar props in its render method
 * by rendering the NavigationBar virtual component.
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

  componentWillMount() {
    this.setStatusBarStyle(this.props.style);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.style !== nextProps.style) {
      this.cleanupStatusBarStyleListeners();
      this.setStatusBarStyle(nextProps.style);
    }
  }

  componentWillUnmount() {
    this.cleanupStatusBarStyleListeners();
  }

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
   * Gets a navigation bar color for props.
   *
   * @param props The props to get the color from.
   * @param colorName The color property name to get.
   * @returns {*} The background color.
   */
  getColor(props, colorName) {
    const color = _.get(props, `style.container.${colorName}`, 'white');
    return getAnimatedStyleValue(color);
  }

  /**
   * Returns the array of previous, current, and next color by getting
   * the color with the given name from the props.
   *
   * @param previousProps The props with the previous color.
   * @param currentProps The props with the current color.
   * @param nextProps The props with the next color.
   * @param colorName The name of the color property to get.
   * @return {*[]} The colors array.
   */
  getColors(previousProps, currentProps, nextProps, colorName) {
    const previousColor = this.getColor(previousProps, colorName);
    const currentColor = this.getColor(currentProps, colorName);
    const nextColor = this.getColor(nextProps, colorName);

    return [previousColor, currentColor, nextColor];
  }

  /**
   * Determine the iOS status bar style based on the backgroundColor
   * of the navigation bar.
   *
   * @param color The navigation bar background color.
   */
  setStatusBarStyleForBackgroundColor(color) {
    const colorValue = getAnimatedStyleValue(color);
    const barStyle = tinyColor(colorValue).isDark() ? 'light-content' : 'default';
    StatusBar.setBarStyle(barStyle);
  }

  /**
   * Set the status bar style based on the style values provided
   * to this component.
   *
   * @param style The component style.
   * @param style.statusBar The status bar style.
   */
  setStatusBarStyle(style = {}) {
    const statusBarStyle = style.statusBar || {};
    if (Platform.OS === 'ios') {
      if (statusBarStyle.barStyle) {
        // Use the status bar style, if present
        StatusBar.setBarStyle(statusBarStyle.barStyle);
      } else {
        // Determine the bar style based on the background color
        // as a fallback if the style is not specified explicitly.
        const backgroundColor = _.get(style, 'container.backgroundColor');
        if (isAnimatedStyleValue(backgroundColor)) {
          // If the backgroundColor is animated, we want to listen for
          // color changes, so that we can update the bar style as the
          // animation runs.
          this.backgroundListenerId = addAnimatedValueListener(backgroundColor, () =>
            this.setStatusBarStyleForBackgroundColor(backgroundColor)
          );
        }

        // Set the bar style based on the current background color value
        this.setStatusBarStyleForBackgroundColor(backgroundColor);
      }
    } else {
      if (!_.isUndefined(statusBarStyle.backgroundColor)) {
        StatusBar.setBackgroundColor(statusBarStyle.backgroundColor);
      }

      if (!_.isUndefined(statusBarStyle.transluscent)) {
        StatusBar.setTranslucent(statusBarStyle.transluscent);
      }
    }
  }

  /**
   * Stop listening to animated style changes required to determine
   * the status bar style.
   */
  cleanupStatusBarStyleListeners() {
    if (this.backgroundListenerId) {
      // Stop listening to background color changes on the
      // old style. The listeners will be registered again,
      // if necessary in `setStatusBarStyle`.
      removeAnimatedValueListener(
        this.props.style.container.backgroundColor,
        this.backgroundListenerId
      );
      this.backgroundListenerId = null;
    }
  }

  /**
   * Manually resolves the next props to match the props that would
   * be received by the component during a normal render cycle. This
   * usually means that we need t manually apply everything that any
   * HOCs do to the props before passing them to this component. We
   * currently only resolve the style by using the functions provided by
   * the parent StyledComponent.
   *
   * @param props The props to resolve.
   * @returns {*} The resolved props.
   */
  resolveNextProps(props) {
    const { resolveStyle } = this.context;

    const style = resolveStyle(props);
    return {
      ...props,
      style,
    };
  }

  resolveSceneProps(scene) {
    const VERSION_KEY = '.version';

    const nextProps = this.getNextNavBarProps(scene);
    const renderedProps = this.getRenderedProps(scene);
    if (renderedProps[VERSION_KEY]) {
      // Return the rendered props, if the next props have been
      // rendered at least once.
      return renderedProps;
    }

    return this.resolveNextProps(nextProps);
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

    const positionValue = getAnimatedStyleValue(position);
    if (positionValue === index) {
      // We are not in a transition, do not override the
      // default style to allow any custom animations that
      // the screen may want to perform on the NavigationBar
      return {};
    }

    // resolveSceneProps will return the latest version of the props
    // from the parent component. This is necessary to perform the
    // animations to the final state of the navigation bar. Otherwise
    // we are often getting various delays and flickers during transitions.
    const previousProps = this.resolveSceneProps(scenes[index - 1]);
    const currentProps = this.resolveSceneProps(scene);
    const nextProps = this.resolveSceneProps(scenes[index + 1]);

    return {
      backgroundColor: position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: this.getColors(previousProps, currentProps, nextProps, 'backgroundColor'),
        extrapolate: 'clamp',
      }),
      borderBottomColor: position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: this.getColors(previousProps, currentProps, nextProps, 'borderBottomColor'),
        extrapolate: 'clamp',
      }),
    };
  }

  /**
   * Wraps the header component render function in a wrapper that
   * exposes the navBarProps to the wrapped functions.
   *
   * @param renderer The function to wrap.
   * @return {function(*): *} The wrapped renderer function.
   */
  createHeaderComponentRenderer(renderer) {
    return (props) => renderer({
      ...props,
      navBarProps: this.props,
    });
  }

  createNavigationHeaderProps() {
    const { style } = this.props;

    const headerProps = {
      ...this.props,
      style: [navigationHeaderStyle, style.navigationHeader],
    };

    if (headerProps.renderLeftComponent) {
      headerProps.renderLeftComponent =
        this.createHeaderComponentRenderer(headerProps.renderLeftComponent);
    }

    if (headerProps.renderTitleComponent) {
      headerProps.renderTitleComponent =
        this.createHeaderComponentRenderer(headerProps.renderTitleComponent);
    }

    if (headerProps.renderRightComponent) {
      headerProps.renderRightComponent =
        this.createHeaderComponentRenderer(headerProps.renderRightComponent);
    }

    return headerProps;
  }

  render() {
    const { scene, style } = this.props;

    // Report our current props, so that next/previous scenes may
    // use them for their animations.
    this.context.setRenderedNavBarProps(scene.route, this.props);

    return (
      <Animated.View style={[style.container, this.interpolateNavBarStyle()]}>
        <NavigationHeader
          {...this.createNavigationHeaderProps()}
        />
      </Animated.View>
    );
  }
}

const AnimatedNavigationBarView = connectAnimation(composeChildren(NavigationBarView), undefined, {
  createAnimatedComponent: false,
});
/**
 * @see {@link NavigationBarStyleName}
 * NavigationBarView style name is related to NavigationBar style name, it must be the same name.
 */
const StyledNavigationBarView = connectStyle(NavigationBarStyleName)(AnimatedNavigationBarView);

export {
  StyledNavigationBarView as NavigationBarView,
};
