import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Icon, Image, Text, View } from '@shoutem/ui';
import ToastProgressBar from './ToastProgressBar';

function BaseToast({
  message,
  title,
  style,
  iconSource,
  iconName,
  onConfirm,
  confirmButtonText,
  onCancel,
  cancelButtonText,
  durationIndicator,
}) {
  const hasConfirmButton = onConfirm && confirmButtonText;
  const hasCancelButton = onCancel && cancelButtonText;

  return (
    <View style={style.container}>
      <View style={style.detailsContainer}>
        {iconSource && <Image source={iconSource} style={style.imageIcon} />}
        {!iconSource && <Icon name={iconName} style={style.icon} />}
        <View>
          {title && <Text>{title}</Text>}
          {message && <Text>{message}</Text>}
        </View>
      </View>
      {(hasConfirmButton || hasCancelButton) && (
        <View>
          {hasCancelButton && (
            <Button>
              <Text>{cancelButtonText}</Text>
            </Button>
          )}
          {hasConfirmButton && (
            <Button>
              <Text>{confirmButtonText}</Text>
            </Button>
          )}
        </View>
      )}
      {durationIndicator && <ToastProgressBar />}
    </View>
  );
}

BaseToast.propTypes = {
  style: PropTypes.object.isRequired,
  cancelButtonText: PropTypes.string,
  confirmButtonText: PropTypes.string,
  durationIndicator: PropTypes.bool,
  iconName: PropTypes.string,
  iconSource: PropTypes.any,
  message: PropTypes.string,
  title: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

BaseToast.defaultProps = {
  title: undefined,
  message: undefined,
  confirmButtonText: undefined,
  cancelButtonText: undefined,
  onCancel: undefined,
  onConfirm: undefined,
  durationIndicator: true,
  iconName: 'info',
  iconSource: undefined,
};

export default connectStyle('shoutem.ui.BaseToast')(BaseToast);
