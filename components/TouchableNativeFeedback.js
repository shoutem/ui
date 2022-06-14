import React, { PureComponent } from 'react';
import { TouchableNativeFeedback as RNTouchableNativeFeedback } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';

class TouchableNativeFeedback extends PureComponent {
  render() {
    const { children, style } = this.props;
    const { background, useForeground, ...otherStyle } = style;

    return (
      <RNTouchableNativeFeedback
        {...this.props}
        style={otherStyle}
        background={background}
        useForeground={useForeground}
      >
        {children}
      </RNTouchableNativeFeedback>
    );
  }
}

TouchableNativeFeedback.propTypes = {
  ...RNTouchableNativeFeedback.propTypes,
  style: PropTypes.shape({
    background: PropTypes.object,
    useForeground: PropTypes.bool,
  }).isRequired,
};

const StyledTouchableNativeFeedback = connectStyle(
  'shoutem.ui.TouchableNativeFeedback',
)(TouchableNativeFeedback);

export { StyledTouchableNativeFeedback as TouchableNativeFeedback };
