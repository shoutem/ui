import React from 'react';
import { connectStyle } from '@shoutem/theme';
import { images } from '../assets';
import BaseToast from './BaseToast';

function SuccessToast({ style, ...props }) {
  return (
    <BaseToast
      customToastStyle={style}
      imageSource={images.success}
      {...props}
    />
  );
}

SuccessToast.propTypes = BaseToast.propTypes;

export default connectStyle('shoutem.ui.SuccessToast')(SuccessToast);
