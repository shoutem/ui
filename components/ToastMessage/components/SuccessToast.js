import React from 'react';
import { connectStyle } from '@shoutem/theme';
import BaseToast from './BaseToast';

function SuccessToast({ style, props, isVisible }) {
  return (
    <BaseToast
      customToastStyle={style}
      iconName="checkmark-round"
      isVisible={isVisible}
      {...props}
    />
  );
}

SuccessToast.propTypes = BaseToast.propTypes;

export default connectStyle('shoutem.ui.SuccessToast')(SuccessToast);
