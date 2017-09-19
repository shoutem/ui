import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import tinyColor from 'tinycolor2';

import {
  Platform,
  StatusBar,
  Animated,
  InteractionManager,
} from 'react-native';
import NavigationExperimental from 'react-native-navigation-experimental-compat';

import { connectStyle } from '@shoutem/theme';
import {
  connectAnimation,
  isAnimatedStyleValue,
  getAnimatedStyleValue,
  addAnimatedValueListener,
  removeAnimatedValueListener,
  TimingDriver,
} from '@shoutem/animation';

import composeChildren from './composeChildren';
import { LinearGradient } from '../components/LinearGradient';

const {
  Header: NavigationHeader,
} = NavigationExperimental;

const navigationHeaderStyle = {
  backgroundColor: 'transparent',
  borderBottomColor: 'transparent',
  borderBottomWidth: 0,
  elevation: 0, // Elevation add side gutter to NavBar
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
class NavigationBarView extends PureComponent {
  static propTypes = {
    ...NavigationHeader.propTypes,
    /**
     * The title to display in the navigation bar.
     */
    title: PropTypes.string,
    /**
     * If this prop exists, and has a valid link,
     * a share control will be rendered as the right
     * component of the navigation bar.
     */
    share: PropTypes.shape({
      title: PropTypes.string,
      text: PropTypes.string,
      link: PropTypes.string,
    }),
    style: PropTypes.object,
    useNativeAnimations: PropTypes.bool,
    // Whether the navigation bar is rendered inline
    // with the screen.
    inline: PropTypes.bool,
    hidden: PropTypes.bool,
    child: PropTypes.bool,
  };

  static defaultProps = {
    // Clear the RN default render functions
    renderTitleComponent: () => null,
    renderLeftComponent: () => null,
    renderRightComponent: () => null,
  };

  static contextTypes = {
    transformProps: PropTypes.func.isRequired,
    getNavBarProps: PropTypes.func.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    if (!_.get(nextProps, 'scene.isActive')) {
      // Ignore inactive scenes
      return;
    }

    if (this.props.inline || this.props.style !== nextProps.style) {
      // We need to refresh the status bar style each
      // time the inline navigation bar gets new props.
      // This is because there will be multiple instances
      // of the navigation bar, and the style will not change
      // when the active instance is swapped out.
      InteractionManager.runAfterInteractions(() => {
        this.cleanupStatusBarStyleListeners();
        this.setStatusBarStyle(nextProps.style);
      });
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
  getNavBarProps(scene = {}) {
    return this.context.getNavBarProps(scene.route);
  }

  /**
   * Gets a navigation bar color for props.
   *
   * @param colorName The color property name to get.
   * @param props The props to get the color from.
   * @returns {*} The background color.
   */
  getColor(colorName, props) {
    const color = _.get(props, `style.container.${colorName}`, 'white');
    return getAnimatedStyleValue(color);
  }

  /**
   * Returns the array of previous, current, and next color by getting
   * the color with the given name from the props.
   *
   * @param colorName The name of the color property to get.
   * @param props The props to extract the color from.
   * @return {*[]} The colors array.
   */
  getColors(colorName, ...props) {
    return _.map(props, _.partial(this.getColor, colorName));
  }

  /**
   * Determine the iOS status bar style based on the backgroundColor
   * of the navigation bar.
   *
   * @param color The navigation bar background color.
   * @param animated If the color change should be animated, iOS only
   */
  setStatusBarStyleForBackgroundColor(color, animated) {
    const colorValue = getAnimatedStyleValue(color);
    const barStyle = tinyColor(colorValue).isDark() ? 'light-content' : 'default';
    StatusBar.setBarStyle(barStyle, animated);
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
          this.backgroundListenerId = addAnimatedValueListener(backgroundColor, () => {
            this.setStatusBarStyleForBackgroundColor(backgroundColor);
          });
        }

        // Set the bar style based on the current background color value
        this.setStatusBarStyleForBackgroundColor(backgroundColor, true);
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
        this.backgroundListenerId,
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
   * @param scene The scene to resolve the props for.
   * @returns {*} The resolved props.
   */
  resolveSceneProps(scene) {
    const nextProps = this.getNavBarProps(scene);
    return this.context.transformProps(nextProps);
  }

  /**
   * Creates a NavBar interpolation by using timed animations
   * instead of relying on the navigation position animated value.
   * This is a workaround in situations when native animations are
   * used, because color animations are not supported by native
   * animation driver at the moment.
   *
   * @param previousProps The props of the previous scene.
   * @param currentProps The props of the current scene.
   * @returns {*} The interpolated style.
   */
  createFallbackNavBarInterpolation(previousProps, currentProps) {
    // Use 250ms as transition duration
    const driver = new TimingDriver({ duration: 250 });
    driver.runTimer(1);

    return {
      backgroundColor: driver.value.interpolate({
        inputRange: [0, 1],
        outputRange: this.getColors('backgroundColor', previousProps, currentProps),
        extrapolate: 'clamp',
      }),
      borderBottomColor: driver.value.interpolate({
        inputRange: [0, 1],
        outputRange: this.getColors('borderBottomColor', previousProps, currentProps),
        extrapolate: 'clamp',
      }),
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

    const positionValue = getAnimatedStyleValue(position);
    if (positionValue === index) {
      // We are not in a transition, do not override the
      // default style to allow any custom animations that
      // the screen may want to perform on the NavigationBar
      return {};
    } else if (this.props.inline) {
      // The navigation bar is rendered inline with the screen,
      // it will be animated together with the screen, so there
      // is no need for custom animations in this case.
      return {};
    }

    // resolveSceneProps will return the latest version of the props
    // from the parent component. This is necessary to perform the
    // animations to the final state of the navigation bar. Otherwise
    // we are often getting various delays and flickers during transitions.
    const currentProps = this.resolveSceneProps(scene);
    if (this.props.useNativeAnimations) {
      // Some animations are not yet implemented in native, so we
      // create JS animations here instead.

      // The position will start at the index of the active scene,
      // and the index will be the index of the scene that will become active.
      const previousProps = this.resolveSceneProps(scenes[positionValue]);
      return this.createFallbackNavBarInterpolation(previousProps, currentProps);
    }

    const previousProps = this.resolveSceneProps(scenes[index - 1]);
    const nextProps = this.resolveSceneProps(scenes[index + 1]);

    return {
      backgroundColor: position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: this.getColors('backgroundColor', previousProps, currentProps, nextProps),
        extrapolate: 'clamp',
      }),
      borderBottomColor: position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: this.getColors('borderBottomColor', previousProps, currentProps, nextProps),
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

  createNavigationHeaderProps(style) {
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

  renderLinearGradient() {
    const { style, animationName } = this.props;
    const animation = _.has(style.gradient, `${animationName}Animation`) ?
      animationName : '';

    if (style.gradient) {
      return (
        <LinearGradient
          animationName={animation}
          style={style.gradient}
        />
      );
    }

    return null;
  }

  renderBackground() {
    const { renderBackground } = this.props;
    if (renderBackground) {
      return renderBackground(this.props);
    }
    return null;
  }

  render() {
    const { scene } = this.props;
    const { style, hidden, child } = this.resolveSceneProps(scene);

    if (hidden || child) {
      // Navigation bar is explicitly hidden, or it just
      // overrides props of a child navigation bar.
      return null;
    }

    return (
      <Animated.View style={[style.container, this.interpolateNavBarStyle()]}>
        {this.renderBackground()}
        {this.renderLinearGradient()}
        <NavigationHeader
          {...this.createNavigationHeaderProps(style)}
        />
      </Animated.View>
    );
  }
}

const mapPropsToStyleNames = (styleNames, props) => {
  if (props.inline) {
    return [...styleNames, 'inline'];
  }

  return styleNames;
};

const AnimatedNavigationBarView = connectAnimation(composeChildren(NavigationBarView), undefined, {
  createAnimatedComponent: false,
});
/**
 * @see {@link NavigationBarStyleName}
 * NavigationBarView style name is related to NavigationBar style name, it must be the same name.
 */
const StyledNavigationBarView =
  connectStyle(NavigationBarStyleName, undefined, mapPropsToStyleNames)(AnimatedNavigationBarView);

export {
  StyledNavigationBarView as NavigationBarView,
};
