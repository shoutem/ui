import React, { useEffect, useMemo, useRef } from 'react';
import ActionSheetNative from 'react-native-actions-sheet';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '../View';
import ActionSheetOption, { optionPropType } from './ActionSheetOption';

const ActionSheet = ({
  active = false,
  cancelOptions = undefined,
  confirmOptions = undefined,
  style,
  onDismiss = undefined,
}) => {
  const actionSheetRef = useRef(null);

  const hasConfirmOptions = useMemo(() => !_.isEmpty(confirmOptions), [
    confirmOptions,
  ]);
  const hasCancelOptions = useMemo(() => !_.isEmpty(cancelOptions), [
    cancelOptions,
  ]);

  useEffect(() => {
    if (active) {
      actionSheetRef.current?.show();
    } else {
      actionSheetRef.current?.hide();
    }
  }, [active]);

  return (
    <ActionSheetNative gestureEnabled ref={actionSheetRef} onClose={onDismiss}>
      <View style={style.contentContainer}>
        {hasConfirmOptions && (
          <View style={style.segmentContainer}>
            {_.map(confirmOptions, option => (
              <ActionSheetOption key={option.title} option={option} />
            ))}
          </View>
        )}
        {hasCancelOptions && (
          <View styleName="md-gutter-top">
            <View style={style.segmentContainer}>
              {_.map(cancelOptions, option => (
                <ActionSheetOption
                  key={option.title}
                  cancelOption
                  option={option}
                />
              ))}
            </View>
          </View>
        )}
      </View>
    </ActionSheetNative>
  );
};

ActionSheet.propTypes = {
  style: PropTypes.object.isRequired,
  active: PropTypes.bool,
  cancelOptions: PropTypes.arrayOf(optionPropType),
  confirmOptions: PropTypes.arrayOf(optionPropType),
  onDismiss: PropTypes.func,
};

ActionSheet.defaultProps = {
  active: false,
  cancelOptions: undefined,
  confirmOptions: undefined,
  onDismiss: undefined,
};

export default connectStyle('shoutem.ui.ActionSheet')(ActionSheet);
