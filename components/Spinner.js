import PropTypes from 'prop-types';
import React from 'react';
import {
  ActivityIndicator,
} from 'react-native';

import { connectStyle } from '@shoutem/theme';

class Spinner extends React.Component {
  render() {
    const { style } = this.props;
    const indicatorStyle = { ...style };
    delete indicatorStyle.size;
    delete indicatorStyle.color;

    return (
      <ActivityIndicator
        animating
        color={style.color}
        size={style.size}
        style={indicatorStyle}
      />
    );
  }
}

Spinner.propTypes = {
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ]),
};

const StyledSpinner = connectStyle('shoutem.ui.Spinner', {
  size: 'small',
})(Spinner);

export {
  StyledSpinner as Spinner,
};
