import React from 'react';
import { connectStyle } from '@shoutem/theme';
import { images } from '../assets';
import BaseToast from './BaseToast';

function ErrorToast({ style, props, isVisible }) {
  return (
    <BaseToast
      customToastStyle={style}
      isVisible={isVisible}
      iconSource={images.error}
      {...props}
    />
  );
}

ErrorToast.propTypes = BaseToast.propTypes;

export default connectStyle('shoutem.ui.ErrorToast')(ErrorToast);
