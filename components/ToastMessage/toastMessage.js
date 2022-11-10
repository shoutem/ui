import React from 'react';
import _ from 'lodash';
import Toast from 'react-native-toast-message';
import { ActionToast, ErrorToast, InfoToast, SuccessToast } from './components';

const NATIVE_PROPS_MAP = ['position', 'visibilityTime', 'autoHide', 'topOffset', 'bottomOffset', 'keyboardOffset', 'onShow', 'onHide', 'onPress'];
const config = {
  'shoutem-success': props => <SuccessToast {...props} />,
  'shoutem-error': props => <ErrorToast {...props} />,
  'shoutem-info': props => <InfoToast {...props} />,
  'shoutem-action': props => <ActionToast {...props} />,
};

function normalizeProps(type, props) {
  const nativeProps = _.pick(props, NATIVE_PROPS_MAP);

  return {
    type,
    ...nativeProps,
    props,
  };
}

export const Provider = () => <Toast config={config} />;

const showAction = props =>
  Toast.show(normalizeProps('shoutem-action', props));

const showInfo = props =>
Toast.show(normalizeProps('shoutem-info', props));

const showSuccess = props =>
Toast.show(normalizeProps('shoutem-success', props));

const showError = props =>
Toast.show(normalizeProps('shoutem-error', props));

export default {
  Provider,
  showAction,
  showError,
  showSuccess,
  showInfo,
  show: Toast.show,
  hide: Toast.hide,
  defaultConfig: config,
};
