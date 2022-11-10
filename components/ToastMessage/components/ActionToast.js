import React from 'react';
import { connectStyle } from '@shoutem/theme';
import { images } from '../assets';
import BaseToast from './BaseToast';

function ActionToast({ style, isVisible, props }) {
  return (
    <BaseToast
      customToastStyle={style}
      imageSource={images.action}
      isVisible={isVisible}
      {...props}
    />
  );
}

ActionToast.propTypes = BaseToast.propTypes;

export default connectStyle('shoutem.ui.ActionToast')(ActionToast);
