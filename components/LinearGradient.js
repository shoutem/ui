import React from 'react';
import RNLinearGradient from 'react-native-linear-gradient';

import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

class LinearGradient extends React.Component {
  render () {
    const { props } = this;

    const style = { ...props.style };
    delete style.colors;
    delete style.locations;

    return (
      <RNLinearGradient
        {...props}
        style={style}
        colors={props.style.colors || []}
        locations={props.style.locations || []}
      >
        {props.children}
      </RNLinearGradient>
    );
  }
}

const AnimatedLinearGradient = connectAnimation(LinearGradient);
const StyledLinearGradient = connectStyle('shoutem.ui.LinearGradient')(AnimatedLinearGradient);

export {
  StyledLinearGradient as LinearGradient,
};
