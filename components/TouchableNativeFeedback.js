import React, { PureComponent } from 'react';
import { TouchableNativeFeedback as RNTouchableNativeFeedback } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { connectStyle } from '@shoutem/theme';

class TouchableNativeFeedback extends PureComponent {
  static propTypes = {
    ...RNTouchableNativeFeedback.propTypes,
    style: PropTypes.shape({
      background: PropTypes.object,
      useForeground: PropTypes.bool,
    }),
  };

  static defaultProps = {
    style: {},
  };

  render() {
    const { style: { background, useForeground } } = this.props;
    // Remove the props that are not valid style keys.
    const cleanProps = _.omit(this.props, ['style.background', 'style.useForeground']);
    const { children, style } = cleanProps;

    return (
      <RNTouchableNativeFeedback
        {...cleanProps}
        style={style}
        background={background}
        useForeground={useForeground}
      >
        {children}
      </RNTouchableNativeFeedback>
    );
  }
}

const StyledTouchableNativeFeedback = connectStyle(
  'shoutem.ui.TouchableNativeFeedback',
)(TouchableNativeFeedback);

export {
  StyledTouchableNativeFeedback as TouchableNativeFeedback,
};
