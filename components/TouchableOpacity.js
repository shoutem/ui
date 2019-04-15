import React, { PureComponent } from 'react';
import { TouchableOpacity as RNTouchableOpacity } from 'react-native';

import { connectStyle } from '@shoutem/theme';

class TouchableOpacity extends PureComponent {
  render() {
    const props = this.props;

    // The activeOpacity is not a valid RN style
    // property, so we have to unset it here.
    const style = {
      ...props.style,
    };
    delete style.activeOpacity;

    return (
      <RNTouchableOpacity
        {...props}
        style={style}
        activeOpacity={props.style.activeOpacity}
      >
        {props.children}
      </RNTouchableOpacity>
    );
  }
}

TouchableOpacity.propTypes = {
  ...RNTouchableOpacity.propTypes,
};

const StyledTouchableOpacity = connectStyle('shoutem.ui.TouchableOpacity')(TouchableOpacity);

export {
  StyledTouchableOpacity as TouchableOpacity,
};
