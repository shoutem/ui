import React from 'react';
import Toast from 'react-native-toast-message';
import _ from 'lodash';
import { ActionToast, ErrorToast, InfoToast, SuccessToast } from './components';

const NATIVE_PROPS_MAP = [
  'position',
  'visibilityTime',
  'autoHide',
  'topOffset',
  'bottomOffset',
  'keyboardOffset',
  'onShow',
  'onHide',
  'onPress',
];
const config = {
  'shoutem-success': props => <SuccessToast {...props} />,
  'shoutem-error': props => <ErrorToast {...props} />,
  'shoutem-info': props => <InfoToast {...props} />,
  'shoutem-action': props => <ActionToast {...props} />,
};
const toastQueue = [];

function normalizeProps(type, props) {
  const nativeProps = _.pick(props, NATIVE_PROPS_MAP);

  return {
    type,
    ...nativeProps,
    onHide: () => {
      if (nativeProps.onHide) {
        nativeProps.onHide();
      }

      handleQueuedToastFinish(props.id);
    },
    props,
  };
}

// Underlying library doesn't support stacking multiple
// toasts, so we queue them instead
const queueToast = (toast, id) => {
  if (_.isEmpty(toastQueue)) {
    toast();
  }

  toastQueue.push({
    id,
    toast,
  });
};

const handleQueuedToastFinish = toastId => {
  _.remove(toastQueue, toastConfig => toastConfig.id === toastId);

  if (!_.isEmpty(toastQueue)) {
    // Start the next toast with a bit of a delay to allow
    // the hide transition to finish
    _.delay(() => _.head(toastQueue).toast(), 300);
  }
};

export const Provider = () => <Toast config={config} />;

const showAction = props => {
  const id = _.uniqueId();

  queueToast(
    () => Toast.show(normalizeProps('shoutem-action', { ...props, id })),
    id,
  );
};

const showInfo = props => {
  const id = _.uniqueId();

  queueToast(
    () => Toast.show(normalizeProps('shoutem-info', { ...props, id })),
    id,
  );
};

const showSuccess = props => {
  const id = _.uniqueId();

  queueToast(
    () => Toast.show(normalizeProps('shoutem-success', { ...props, id })),
    id,
  );
};

const showError = props => {
  const id = _.uniqueId();

  queueToast(
    () => Toast.show(normalizeProps('shoutem-error', { ...props, id })),
    id,
  );
};

const showDefault = props => {
  const id = _.uniqueId();

  queueToast(() => Toast.show({ ...props, id }), id);
};

export default {
  Provider,
  showAction,
  showError,
  showSuccess,
  showInfo,
  show: showDefault,
  hide: Toast.hide,
  defaultConfig: config,
};
