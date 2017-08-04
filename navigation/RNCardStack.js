import React from 'react';
import NavigationExperimental from 'react-native-navigation-experimental-compat';
import NavigationCardStackStyleInterpolator from 'react-native-navigation-experimental-compat/src/NavigationCardStackStyleInterpolator';
import NavigationCardStackPanResponder from 'react-native-navigation-experimental-compat/src/NavigationCardStackPanResponder';

const { CardStack, Card } = NavigationExperimental;

const isVertical = props => props.direction === 'vertical';

// CardStack from RN doesn't allow customizations of the
// navigation transitions from outside of the component.
// This component allows for that by introducing two
// optional props:
// 1. interpolateCardStyle on the CardStack - if this function
//    is provided it will be used instead of the default card
//    style interpolator to produce the animated style for
//    transitions.
//
// 2. interpolateStyle in the navigation routes - this function
//    may be provided through the navigation routes. This allows
//    the users to customize the navigation transition for a
//    specific route.
//
// If none of the above functions are provided, the default
// interpolator will be used (ReactNativeCardStackStyleInterpolator).
export class RNCardStack extends CardStack {
  interpolateStyle(props) {
    if (props.scene.route.interpolateStyle) {
      return props.scene.route.interpolateStyle(props);
    }

    return this.props.interpolateCardStyle(props);
  }

  _renderScene(props) {
    const style = this.interpolateStyle(props);

    const panHandlersProps = {
      ...props,
      onNavigateBack: this.props.onNavigateBack,
      gestureResponseDistance: this.props.gestureResponseDistance,
    };

    const panHandlers = isVertical(this.props) ?
      NavigationCardStackPanResponder.forVertical(panHandlersProps) :
      NavigationCardStackPanResponder.forHorizontal(panHandlersProps);

    return (
      <Card
        {...props}
        key={'card_' + props.scene.key}
        panHandlers={panHandlers}
        renderScene={this.props.renderScene}
        style={[style, this.props.cardStyle]}
      />
    );
  }
}

RNCardStack.defaultProps.interpolateCardStyle = props => {
  return isVertical(props) ?
    NavigationCardStackStyleInterpolator.forVertical(props):
    NavigationCardStackStyleInterpolator.forHorizontal(props);
};
