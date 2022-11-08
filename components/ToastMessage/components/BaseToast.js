import React, { useMemo } from 'react';
import _ from 'lodash';
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
  visibilityTime,
  customToastStyle,
}) {
  const hasConfirmButton = onConfirm && confirmButtonText;
  const hasCancelButton = onCancel && cancelButtonText;
  const resolvedStyle = useMemo(() => _.merge(style, customToastStyle), [
    style,
    customToastStyle,
  ]);

  return (
    <View style={resolvedStyle.container}>
      <View style={resolvedStyle.detailsContainer}>
        {iconSource && (
          <Image source={iconSource} style={resolvedStyle.imageIcon} />
        )}
        {!iconSource && <Icon name={iconName} style={resolvedStyle.icon} />}
        <View style={resolvedStyle.textContainer}>
          {title && <Text style={resolvedStyle.title}>{title}</Text>}
          {message && <Text style={resolvedStyle.message}>{message}</Text>}
        </View>
      </View>
      {(hasConfirmButton || hasCancelButton) && (
        <View style={resolvedStyle.buttonContainer}>
          {hasCancelButton && (
            <Button style={resolvedStyle.button}>
              <Text style={resolvedStyle.buttonText}>{cancelButtonText}</Text>
            </Button>
          )}
          {hasConfirmButton && (
            <Button style={resolvedStyle.button}>
              <Text style={resolvedStyle.buttonText}>{confirmButtonText}</Text>
            </Button>
          )}
        </View>
      )}
      {durationIndicator && (
        <ToastProgressBar
          duration={visibilityTime}
          color={style.progressBar.color}
        />
      )}
    </View>
  );
}

BaseToast.propTypes = {
  style: PropTypes.object.isRequired,
  cancelButtonText: PropTypes.string,
  confirmButtonText: PropTypes.string,
  customToastStyle: PropTypes.object,
  durationIndicator: PropTypes.bool,
  iconName: PropTypes.string,
  iconSource: PropTypes.any,
  message: PropTypes.string,
  title: PropTypes.string,
  visibilityTime: PropTypes.number,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

BaseToast.defaultProps = {
  customToastStyle: {},
  title: undefined,
  message: undefined,
  confirmButtonText: undefined,
  cancelButtonText: undefined,
  onCancel: undefined,
  onConfirm: undefined,
  durationIndicator: true,
  iconName: 'info',
  iconSource: undefined,
  visibilityTime: 4000,
};

export default connectStyle('shoutem.ui.BaseToast')(BaseToast);
