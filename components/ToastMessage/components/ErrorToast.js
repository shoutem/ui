import React from 'react';
import { connectStyle } from '@shoutem/theme';
import BaseToast from './BaseToast';

function ErrorToast({ style, props, isVisible }) {
  return (
    <BaseToast
      customToastStyle={style}
      isVisible={isVisible}
      iconName="error-rectangle"
      {...props}
    />
  );
}

ErrorToast.propTypes = BaseToast.propTypes;

export default connectStyle('shoutem.ui.ErrorToast')(ErrorToast);
