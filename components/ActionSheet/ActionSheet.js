import React, { PureComponent } from 'react';
import { Animated, TouchableOpacity, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import autoBind from 'auto-bind/react';
import _ from 'lodash';

import { connectStyle } from '@shoutem/theme';

import { IPHONE_X_HOME_INDICATOR_PADDING } from '../../const';
import { Device } from '../../helpers';
import { View } from '../View';
import ActionSheetOption, { optionPropType } from './ActionSheetOption';

const { height: windowHeight } = Dimensions.get('window');

function getContentOffset(contentHeight = windowHeight) {
  if (Device.isIphoneXR || Device.isIphoneX) {
    return contentHeight + IPHONE_X_HOME_INDICATOR_PADDING;
  }

  return contentHeight;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

class ActionSheet extends PureComponent {
  static propTypes = {
    style: PropTypes.any,
    confirmOptions: PropTypes.arrayOf(optionPropType),
    cancelOptions: PropTypes.arrayOf(optionPropType),
    active: PropTypes.bool,
    onDismiss: PropTypes.func,
  };

  static defaultProps = {
    style: {},
    confirmOptions: undefined,
    cancelOptions: undefined,
    active: false,
    onDismiss: undefined,
  };

  constructor(props) {
    super(props);

    autoBind(this);

    this.state = {
      opacity: new Animated.Value(0),
      yPos: new Animated.Value(0),
      visible: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { active } = this.props;
    const { active: prevActive } = prevProps;

    if (active && !prevActive) {
      this.setState({ visible: true }, this.handleEntryAnimation);
    }

    if (!active && prevActive) {
      this.handleExitAnimation();
    }
  }

  hideComponent() {
    this.setState({ visible: false });
  }

  handleContentLayout(event) {
    const height = _.get(event, 'nativeEvent.layout.height', 0);

    this.setState({ height });
  }

  handleEntryAnimation() {
    const { yPos, opacity } = this.state;

    const toValue = 1;

    Animated.parallel([
      Animated.spring(yPos, {
        toValue,
      }),
      Animated.timing(opacity, {
        toValue,
      }),
    ]).start();
  }

  handleExitAnimation() {
    const { yPos, opacity } = this.state;

    const toValue = 0;

    Animated.parallel([
      Animated.spring(yPos, {
        toValue,
      }),
      Animated.timing(opacity, {
        toValue,
        delay: 100,
        duration: 150,
      }),
    ]).start(this.hideComponent);
  }

  handleInactiveAreaPress() {
    const { onDismiss } = this.props;

    if (onDismiss) {
      onDismiss();
    }
  }

  render() {
    const {
      confirmOptions,
      cancelOptions,
      style,
    } = this.props;
    const {
      opacity,
      yPos,
      visible,
      height,
    } = this.state;

    const hasConfirmOptions = !_.isEmpty(confirmOptions);
    const hasCancelOptions = !_.isEmpty(cancelOptions);

    if (!visible || (!hasConfirmOptions && !hasCancelOptions)) {
      return null;
    }

    return (
      <AnimatedTouchable
        activeOpacity={1}
        onPress={this.handleInactiveAreaPress}
        style={[
          style.container,
          {
            backgroundColor: opacity.interpolate({
              inputRange: [0, 1],
              outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.3)'],
            }),
          },
        ]}
      >
        <Animated.View
          onLayout={this.handleContentLayout}
          style={[style.contentContainer, {
            transform: [{
              translateY: yPos.interpolate({
                inputRange: [0, 1],
                outputRange: [getContentOffset(height), 0],
              }),
            }],
          }]}
        >
          {hasConfirmOptions && (
            <View style={style.segmentContainer}>
              {_.map(
                confirmOptions,
                option => <ActionSheetOption key={option.title} option={option} />,
              )}
            </View>
          )}
          {hasCancelOptions && (
            <View styleName="md-gutter-top">
              <View style={style.segmentContainer}>
                {_.map(
                  cancelOptions,
                  option => <ActionSheetOption key={option.title} cancelOption option={option} />,
                )}
              </View>
            </View>
          )}
        </Animated.View>
      </AnimatedTouchable>
    );
  }
}

export default connectStyle('shoutem.ui.ActionSheet')(ActionSheet);
