import React, { PureComponent } from 'react';
import RNLinearGradient from 'react-native-linear-gradient';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

const RNLinearGradientPropsKeys = ['start', 'end', 'colors', 'locations'];

class LinearGradient extends PureComponent {
  render() {
    const { props } = this;

    const styleWithOmissions = _.omit(props.style, RNLinearGradientPropsKeys);
    const linearGradientProps = {
      ...props,
      ..._.pick(props.style, RNLinearGradientPropsKeys),
    };

    return (
      <RNLinearGradient {...linearGradientProps} style={styleWithOmissions}>
        {props.children}
      </RNLinearGradient>
    );
  }
}

LinearGradient.propTypes = {
  style: PropTypes.object.isRequired,
  children: PropTypes.node,
};

LinearGradient.defaultProps = {
  children: undefined,
};

const AnimatedLinearGradient = connectAnimation(LinearGradient);
const StyledLinearGradient = connectStyle('shoutem.ui.LinearGradient')(
  AnimatedLinearGradient,
);

export { StyledLinearGradient as LinearGradient };
