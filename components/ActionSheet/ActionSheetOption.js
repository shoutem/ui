import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { isIos } from '../../services';
import { Text } from '../Text';
import { TouchableOpacity } from '../TouchableOpacity';

export const optionPropType = PropTypes.shape({
  title: PropTypes.string,
  onPress: PropTypes.func,
});

function ActionSheetOption({ style, option, cancelOption, nativeStyle }) {
  const { title, onPress } = option;

  const useIosTextColor = nativeStyle && isIos;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={style.container}
      styleName="horizontal"
    >
      <Text
        style={[
          style.text,
          cancelOption && style.cancelText,
          useIosTextColor && style.iosBlueTextColor,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

ActionSheetOption.propTypes = {
  style: PropTypes.object.isRequired,
  cancelOption: PropTypes.bool,
  nativeStyle: PropTypes.bool,
  option: optionPropType,
};

ActionSheetOption.defaultProps = {
  option: undefined,
  cancelOption: false,
  nativeStyle: false,
};

export default connectStyle('shoutem.ui.ActionSheetOption')(ActionSheetOption);
