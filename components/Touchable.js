import React, { PureComponent } from 'react';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { TouchableNativeFeedback } from './TouchableNativeFeedback';
import { TouchableOpacity } from './TouchableOpacity';
import { View } from './View';

/**
 * A universal touchable component with a platform specific feedback. This
 * component displays a TouchableOpacity on iOS, and a TouchableNativeFeedback
 * on Android.
 */
class Touchable extends PureComponent {
  render() {
    const { children, style, styleName } = this.props;
    const { touchableNativeFeedback, touchableOpacity, ...otherStyle } = style;

    if (Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback
          {...this.props}
          style={touchableNativeFeedback}
        >
          <View virtual style={otherStyle} styleName={styleName}>
            {children}
          </View>
        </TouchableNativeFeedback>
      );
    }

    return (
      <TouchableOpacity
        {...this.props}
        style={{
          ...otherStyle,
          ...touchableOpacity,
        }}
      >
        {children}
      </TouchableOpacity>
    );
  }
}

Touchable.propTypes = {
  ...TouchableOpacity.propTypes,
  ...TouchableNativeFeedback.propTypes,
  style: PropTypes.object.isRequired,
};

const StyledTouchable = connectStyle('shoutem.ui.Touchable', {
  touchableNativeFeedback: {},
  touchableOpacity: {},
})(Touchable);

export { StyledTouchable as Touchable };
