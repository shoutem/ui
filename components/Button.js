import React, { PureComponent } from 'react';
import { TouchableOpacity } from 'react-native';

import { connectStyle } from '@shoutem/theme';
import { connectAnimation } from '@shoutem/animation';

class Button extends PureComponent {
  render() {
    // The underlayColor is not a valid RN style
    // property, so we have to unset it here.
    const style = {
      ...this.props.style,
    };
    delete style.underlayColor;

    return (
      <TouchableOpacity
        {...this.props}
        style={style}
        underlayColor={this.props.style.underlayColor}
      />
    );
  }
}

Button.propTypes = {
  ...TouchableOpacity.propTypes,
};

const AnimatedButton = connectAnimation(Button);
const StyledButton = connectStyle('shoutem.ui.Button')(AnimatedButton);
export {
  StyledButton as Button,
};
