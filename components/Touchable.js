import React, { PureComponent } from 'react';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { connectStyle } from '@shoutem/theme';

import { View } from './View';
import { TouchableOpacity } from './TouchableOpacity';
import { TouchableNativeFeedback } from './TouchableNativeFeedback';

/**
 * A universal touchable component with a
 * platform specific feedback. This
 * component displays a TouchableOpacity on
 * iOS, and a TouchableNativeFeedback on
 * Android.
 */
class Touchable extends PureComponent {
  static propTypes = {
    ...TouchableOpacity.propTypes,
    ...TouchableNativeFeedback.propTypes,
    style: PropTypes.object,
  };

  static defaultProps = {
    style: {},
  };

  render() {
    const { style: { touchableNativeFeedback, touchableOpacity } } = this.props;
    // Remove the props that are not valid style keys.
    const cleanProps = _.omit(
      this.props,
      ['style.touchableNativeFeedback', 'style.touchableOpacity'],
    );

    const { children, style, styleName } = cleanProps;

    if (Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback
          {...cleanProps}
          style={touchableNativeFeedback}
        >
          <View virtual style={style} styleName={styleName}>
            {children}
          </View>
        </TouchableNativeFeedback>
      );
    }

    return (
      <TouchableOpacity
        {...cleanProps}
        style={{
          ...style,
          ...touchableOpacity,
        }}
      >
        {children}
      </TouchableOpacity>
    );
  }
}

const StyledTouchable = connectStyle('shoutem.ui.Touchable', {
  touchableNativeFeedback: {},
  touchableOpacity: {},
})(Touchable);

export {
  StyledTouchable as Touchable,
};
