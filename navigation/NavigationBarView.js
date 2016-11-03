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
    const color = _.get(props, 'style.container.backgroundColor', 'white');

    // If this is an animated value, we want to convert it to
    // a plain object in order to get its current value.
    if (color.toJSON) {
      return color.toJSON();
    }

    return color;
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

    const positionValue = position.toJSON();
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
        <StatusBar translucent />
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
const StyledNavigationBarView = connectStyle('shoutem.ui.navigation.NavigationBar')(
  AnimatedNavigationBarView
);

export {
  StyledNavigationBarView as NavigationBarView,
};
