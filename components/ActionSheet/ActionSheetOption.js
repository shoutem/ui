import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text } from '../Text';
import { TouchableOpacity } from '../TouchableOpacity';

export const optionPropType = PropTypes.shape({
  title: PropTypes.string,
  onPress: PropTypes.func,
});

function ActionSheetOption({ style, option, cancelOption }) {
  const { title, onPress } = option;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={style.container}
      styleName="horizontal"
    >
      <Text style={[style.text, cancelOption && style.cancelText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

ActionSheetOption.propTypes = {
  style: PropTypes.any,
  option: optionPropType,
  cancelOption: PropTypes.bool,
};

export default connectStyle('shoutem.ui.ActionSheetOption')(ActionSheetOption);
