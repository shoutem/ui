import React, { PureComponent } from 'react';
import { TouchableNativeFeedback as RNTouchableNativeFeedback } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';

class TouchableNativeFeedback extends PureComponent {
  static propTypes = {
    ...RNTouchableNativeFeedback.propTypes,
    style: PropTypes.shape({
      background: PropTypes.object,
      useForeground: PropTypes.bool,
    }),
  };

  render() {
    const { props } = this;
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
}

const StyledTouchableNativeFeedback = connectStyle(
  'shoutem.ui.TouchableNativeFeedback',
)(TouchableNativeFeedback);

export { StyledTouchableNativeFeedback as TouchableNativeFeedback };
