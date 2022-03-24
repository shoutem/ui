import React, { PureComponent } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';

class Spinner extends PureComponent {
  render() {
    const { style } = this.props;
    const { color, size, ...otherStyle } = style;

    return (
      <ActivityIndicator
        animating
        color={color}
        size={size}
        style={otherStyle}
      />
    );
  }
}

Spinner.propTypes = {
  style: PropTypes.object,
};

const StyledSpinner = connectStyle('shoutem.ui.Spinner', {
  size: 'small',
})(Spinner);

export { StyledSpinner as Spinner };
