import React, { PureComponent } from 'react';
import { TouchableOpacity } from 'react-native';
import _ from 'lodash';

import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

class Button extends PureComponent {
  static propTypes = {
    ...TouchableOpacity.propTypes,
  };

  render() {
    const { style: { underlayColor } } = this.props;
    // Remove the props that are not valid style keys.
    const cleanProps = _.omit(this.props, 'style.underlayColor');
    const { style } = cleanProps;

    return (
      <TouchableOpacity
        {...cleanProps}
        style={style}
        underlayColor={underlayColor}
      />
    );
  }
}

const AnimatedButton = connectAnimation(Button);
const StyledButton = connectStyle('shoutem.ui.Button')(AnimatedButton);
export {
  StyledButton as Button,
};
