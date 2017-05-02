import React, { PropTypes } from 'react';
import { Platform } from 'react-native';

import { connectStyle } from '@shoutem/theme';

import {
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
} from '../index';

/**
 * A universal touchable component with a
 * platform specific feedback. This
 * component displays a TouchableOpacity on
 * iOS, and a TouchableNativeFeedback on
 * Android.
 */
function Touchable(props) {
  const style = { ...props.style };
  delete style.touchableOpacity;
  delete style.touchableNativeFeedback;

  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback
        {...props}
        style={props.style.touchableNativeFeedback}
      >
        <View
          virtual
          style={style}
          styleName={props.styleName}
        >
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

Touchable.propTypes = {
  ...TouchableOpacity.propTypes,
  ...TouchableNativeFeedback.propTypes,
  style: PropTypes.object,
};

const StyledTouchable = connectStyle('shoutem.ui.Touchable', {
  touchableNativeFeedback: {},
  touchableOpacity: {},
})(Touchable);

export {
  StyledTouchable as Touchable,
};
