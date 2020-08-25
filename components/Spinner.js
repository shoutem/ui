import React, { PureComponent } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { connectStyle } from '@shoutem/theme';

class Spinner extends PureComponent {
  static propTypes = {
    style: PropTypes.object,
  };

  static defaultProps = {
    style: {},
  };

  render() {
    const { style, style: { color, size } } = this.props;
    const cleanStyle = _.omit(style, ['color', 'size']);

    return (
      <ActivityIndicator
        animating
        color={color}
        size={size}
        style={cleanStyle}
      />
    );
  }
}

const StyledSpinner = connectStyle('shoutem.ui.Spinner', { size: 'small' })(Spinner);

export {
  StyledSpinner as Spinner,
};
