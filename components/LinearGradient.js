import React, { PureComponent } from 'react';
import RNLinearGradient from 'react-native-linear-gradient';
import _ from 'lodash';
import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

const RNLinearGradientPropsKeys = Object.keys(RNLinearGradient.propTypes);

class LinearGradient extends PureComponent {
  render () {
    const { props } = this;

    const style = { ..._.omit(props.style, RNLinearGradientPropsKeys) };

    return (
      <RNLinearGradient
        {...props}
        {..._.pick(props.style, RNLinearGradientPropsKeys)}
        style={style}
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
