import React, { PureComponent } from 'react';
import RNLinearGradient from 'react-native-linear-gradient';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

const RNLinearGradientPropsKeys = ['start', 'end', 'colors', 'locations'];

class LinearGradient extends PureComponent {
  render() {
    const { children, style } = this.props;

    const styleWithOmissions = _.omit(style, RNLinearGradientPropsKeys);
    const linearGradientProps = {
      ...this.props,
      ..._.pick(style, RNLinearGradientPropsKeys),
    };

    return (
      <RNLinearGradient {...linearGradientProps} style={styleWithOmissions}>
        {children}
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
