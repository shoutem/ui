import React, { PureComponent } from 'react';
import { TouchableOpacity } from 'react-native';
import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

class Button extends PureComponent {
  render() {
    const { style } = this.props;
    const { underlayColor } = style;
    // The underlayColor is not a valid RN style property, so we have to unset
    // it here.
    delete style.underlayColor;

    return (
      <TouchableOpacity
        {...this.props}
        style={style}
        underlayColor={underlayColor}
      />
    );
  }
}

Button.propTypes = {
  ...TouchableOpacity.propTypes,
};

const AnimatedButton = connectAnimation(Button);
const StyledButton = connectStyle('shoutem.ui.Button')(AnimatedButton);
export { StyledButton as Button };
