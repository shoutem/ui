import React from 'react';
import { connectStyle } from '@shoutem/theme';
import BaseToast from './BaseToast';

function ActionToast({ style, isVisible, props }) {
  return (
    <BaseToast
      customToastStyle={style}
      iconName="checkmark-oval"
      isVisible={isVisible}
      {...props}
    />
  );
}

ActionToast.propTypes = BaseToast.propTypes;

export default connectStyle('shoutem.ui.ActionToast')(ActionToast);
