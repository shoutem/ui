import React, { PureComponent } from 'react';
import { TouchableOpacity } from 'react-native';
import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

class Button extends PureComponent {
  render() {
    const { style, ...otherProps } = this.props;
    const { underlayColor, ...otherStyle } = style;

    return (
      <TouchableOpacity
        {...otherProps}
        style={otherStyle}
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
