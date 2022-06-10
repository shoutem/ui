import React, { PureComponent } from 'react';
import { TouchableOpacity as RNTouchableOpacity } from 'react-native';
import { connectStyle } from '@shoutem/theme';

class TouchableOpacity extends PureComponent {
  render() {
    const { children, style } = this.props;
    const { activeOpacity, ...otherStyle } = style;

    return (
      <RNTouchableOpacity
        {...this.props}
        style={otherStyle}
        activeOpacity={activeOpacity}
      >
        {children}
      </RNTouchableOpacity>
    );
  }
}

TouchableOpacity.propTypes = {
  ...RNTouchableOpacity.propTypes,
};

const StyledTouchableOpacity = connectStyle('shoutem.ui.TouchableOpacity')(
  TouchableOpacity,
);

export { StyledTouchableOpacity as TouchableOpacity };
