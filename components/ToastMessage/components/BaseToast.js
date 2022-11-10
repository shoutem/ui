import React, { useMemo } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, Image, Text, View, Touchable } from '@shoutem/ui';
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
  isVisible,
}) {
  const hasConfirmButton = onConfirm && confirmButtonText;
  const hasCancelButton = onCancel && cancelButtonText;
  const resolvedStyle = useMemo(() => _.merge(style, customToastStyle), [
    style,
    customToastStyle,
  ]);

  console.log(resolvedStyle);

  return (
    <View style={resolvedStyle.container}>
      <View style={resolvedStyle.detailsContainer}>
        {iconSource && (
          <Image source={iconSource} style={resolvedStyle.image} />
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
            <Touchable style={[resolvedStyle.button, resolvedStyle.cancelButton, !hasConfirmButton && resolvedStyle.fullWidthButton]} onPress={onCancel}>
              <Text style={[resolvedStyle.buttonText, resolvedStyle.cancelButtonText]}>{cancelButtonText}</Text>
            </Touchable>
          )}
          {hasConfirmButton && (
            <Touchable style={[resolvedStyle.button, resolvedStyle.confirmButton, !hasCancelButton && resolvedStyle.fullWidthButton]} onPress={onConfirm}>
              <Text style={[resolvedStyle.buttonText, resolvedStyle.confirmButtonText]}>{confirmButtonText}</Text>
            </Touchable>
          )}
        </View>
      )}
          <ToastProgressBar
            duration={visibilityTime}
            color={resolvedStyle.progressBar.color}
            visible={isVisible && durationIndicator}
          />
    </View>
  );
}

BaseToast.propTypes = {
  isVisible: PropTypes.bool.isRequired,
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
