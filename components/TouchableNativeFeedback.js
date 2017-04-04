import React, { PropTypes } from 'react';
import { TouchableNativeFeedback as RNTouchableNativeFeedback } from 'react-native';

import { connectStyle } from '@shoutem/theme';

function TouchableNativeFeedback(props) {
  // Remove the props that are not valid
  // style keys.
  const style = {
    ...props.style,
  };
  delete style.background;
  delete style.useForeground;

  return (
    <RNTouchableNativeFeedback
      {...props}
      style={style}
      background={props.style.background}
      useForeground={props.style.useForeground}
    >
      {props.children}
    </RNTouchableNativeFeedback>
  );
}

TouchableNativeFeedback.propTypes = {
  ...RNTouchableNativeFeedback.propTypes,
  style: PropTypes.shape({
    background: PropTypes.object,
    useForeground: PropTypes.bool,
  }),
};

const StyledTouchableNativeFeedback =
  connectStyle('shoutem.ui.TouchableNativeFeedback')(TouchableNativeFeedback);

export {
  StyledTouchableNativeFeedback as TouchableNativeFeedback,
};
