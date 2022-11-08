import React from 'react';
import Toast from 'react-native-toast-message';
import { ActionToast, ErrorToast, InfoToast, SuccessToast } from './components';

const config = {
  success: props => <SuccessToast {...props} />,
  error: props => <ErrorToast {...props} />,
  info: props => <InfoToast {...props} />,
  action: props => <ActionToast {...props} />,
};

export const Provider = () => <Toast config={config} />;

const showAction = props =>
  Toast.show({
    type: 'action',
    ...props,
  });

const showInfo = props =>
  Toast.show({
    type: 'info',
    ...props,
  });

const showSuccess = props =>
  Toast.show({
    type: 'success',
    ...props,
  });

const showError = props =>
  Toast.show({
    type: 'error',
    ...props,
  });

export default {
  Provider,
  showAction,
  showError,
  showSuccess,
  showInfo,
  defaultConfig: config,
};
