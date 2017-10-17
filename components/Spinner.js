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
  style: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.number,
  ]),
};

const StyledSpinner = connectStyle('shoutem.ui.Spinner', {
  size: 'small',
})(Spinner);

export {
  StyledSpinner as Spinner,
};
