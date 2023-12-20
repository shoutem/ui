import React from 'react';
import { Switch as RNSwitch } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from './View';

const Switch = ({ value, onValueChange, style }) => (
  <View style={style.container}>
    <RNSwitch
      trackColor={style.track}
      thumbColor={style.thumb}
      ios_backgroundColor={style.track?.false}
      onValueChange={onValueChange}
      value={value}
    />
  </View>
);

Switch.propTypes = {
  onValueChange: PropTypes.func.isRequired,
  style: PropTypes.object,
  value: PropTypes.bool,
};

Switch.defaultProps = {
  value: false,
  style: {},
};

const StyledSwitch = connectStyle('shoutem.ui.Switch')(Switch);

export { StyledSwitch as Switch };
