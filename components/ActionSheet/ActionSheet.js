import React, { PureComponent } from 'react';
import { Animated, Dimensions, TouchableOpacity } from 'react-native';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
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
  static getDerivedStateFromProps(props, state) {
    const { active } = props;
    const { visible } = state;

    if (active !== visible) {
      return { visible: active };
    }

    return null;
  }

  constructor(props) {
    super(props);

    autoBindReact(this);

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
      this.handleEntryAnimation();
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
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue,
        useNativeDriver: false,
      }),
    ]).start();
  }

  handleExitAnimation() {
    const { yPos, opacity } = this.state;

    const toValue = 0;

    Animated.parallel([
      Animated.spring(yPos, {
        toValue,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue,
        delay: 100,
        duration: 150,
        useNativeDriver: false,
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
    const { confirmOptions, cancelOptions, style } = this.props;
    const { opacity, yPos, visible, height } = this.state;

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
          style={[
            style.contentContainer,
            {
              transform: [
                {
                  translateY: yPos.interpolate({
                    inputRange: [0, 1],
                    outputRange: [getContentOffset(height), 0],
                  }),
                },
              ],
            },
          ]}
        >
          {hasConfirmOptions && (
            <View style={style.segmentContainer}>
              {_.map(confirmOptions, option => (
                <ActionSheetOption key={option.title} option={option} />
              ))}
            </View>
          )}
          {hasCancelOptions && (
            <View styleName="md-gutter-top">
              <View style={style.segmentContainer}>
                {_.map(cancelOptions, option => (
                  <ActionSheetOption
                    key={option.title}
                    cancelOption
                    option={option}
                  />
                ))}
              </View>
            </View>
          )}
        </Animated.View>
      </AnimatedTouchable>
    );
  }
}

ActionSheet.propTypes = {
  style: PropTypes.object.isRequired,
  active: PropTypes.bool,
  cancelOptions: PropTypes.arrayOf(optionPropType),
  confirmOptions: PropTypes.arrayOf(optionPropType),
  onDismiss: PropTypes.func,
};

ActionSheet.defaultProps = {
  active: false,
  cancelOptions: undefined,
  confirmOptions: undefined,
  onDismiss: undefined,
};

export default connectStyle('shoutem.ui.ActionSheet')(ActionSheet);
