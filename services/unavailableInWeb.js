import { Platform } from 'react-native';
import { Toast } from '@shoutem/ui';

const isWeb = Platform.OS === 'web';

export const unavailableInWeb = callback => {
  if (!isWeb) {
    return callback;
  }

  return () =>
    Toast.showInfo({
      title: 'Feature currently unavailable',
      message:
        'This feature is currently unavailable in Web Preview. For better preview experience download Disclose app.',
    });
};
