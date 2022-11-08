import React from 'react';
import { connectStyle } from '@shoutem/theme';
import BaseToast from './BaseToast';

function InfoToast({ style, ...props }) {
  return <BaseToast customToastStyle={style} {...props} />;
}

InfoToast.propTypes = BaseToast.propTypes;

export default connectStyle('shoutem.ui.InfoToast')(InfoToast);
