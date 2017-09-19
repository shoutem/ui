import React from 'react';
import {
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';

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
  style: PropTypes.object,
};

const StyledSpinner = connectStyle('shoutem.ui.Spinner', {
  size: 'small',
})(Spinner);

export {
  StyledSpinner as Spinner,
};
