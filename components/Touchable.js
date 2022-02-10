import React, { PureComponent } from 'react';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { TouchableNativeFeedback } from './TouchableNativeFeedback';
import { TouchableOpacity } from './TouchableOpacity';
import { View } from './View';

/**
 * A universal touchable component with a
 * platform specific feedback. This
 * component displays a TouchableOpacity on
 * iOS, and a TouchableNativeFeedback on
 * Android.
 */
class Touchable extends PureComponent {
  static propTypes = {
    ...TouchableOpacity.propTypes,
    ...TouchableNativeFeedback.propTypes,
    style: PropTypes.object,
  };

  render() {
    const { props } = this;
    const style = { ...props.style };
    delete style.touchableOpacity;
    delete style.touchableNativeFeedback;

    if (Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback
          {...props}
          style={props.style.touchableNativeFeedback}
        >
          <View virtual style={style} styleName={props.styleName}>
            {props.children}
          </View>
        </TouchableNativeFeedback>
      );
    }

    return (
      <TouchableOpacity
        {...props}
        style={{
          ...style,
          ...props.style.touchableOpacity,
        }}
      >
        {props.children}
      </TouchableOpacity>
    );
  }
}

const StyledTouchable = connectStyle('shoutem.ui.Touchable', {
  touchableNativeFeedback: {},
  touchableOpacity: {},
})(Touchable);

export { StyledTouchable as Touchable };
