import React from 'react';
import {
  ActivityIndicator,
} from 'react-native';

import { connectStyle } from '@shoutem/theme';

function Spinner({ style }) {
  const indicatorStyle = { ...style };
  delete indicatorStyle.size;

  return (
    <ActivityIndicator
      animating
      size={style.size}
      style={indicatorStyle}
    />
  );
}

Spinner.propTypes = {
  style: React.PropTypes.object,
};

const StyledSpinner = connectStyle('shoutem.ui.Spinner', {
  size: 'small',
})(Spinner);

export {
  StyledSpinner as Spinner,
};
