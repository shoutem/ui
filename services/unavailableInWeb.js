import { Platform } from 'react-native';
import { Toast } from '@shoutem/ui';
import _ from 'lodash';

const isWeb = Platform.OS === 'web';

export const unavailableInWeb = callback => {
  if (!isWeb) {
    return callback;
  }

  // If callback is undefined, show toast immediatelly.
  if (_.isUndefined(callback)) {
    Toast.showInfo({
      title: 'Feature currently unavailable',
      message:
        'This feature is currently unavailable in Web Preview. For better preview experience download Disclose app.',
    });
  }

  // Otherwise, return callback to be executed on user action.

  return () =>
    Toast.showInfo({
      title: 'Feature currently unavailable',
      message:
        'This feature is currently unavailable in Web Preview. For better preview experience download Disclose app.',
    });
};
