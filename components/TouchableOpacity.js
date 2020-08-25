import React, { PureComponent } from 'react';
import { TouchableOpacity as RNTouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { connectStyle } from '@shoutem/theme';

class TouchableOpacity extends PureComponent {
  static propTypes = {
    ...RNTouchableOpacity.propTypes,
    style: PropTypes.object,
  };

  static defaultProps = {
    style: {},
  };

  render() {
    const { style: { activeOpacity } } = this.props;
    // Remove the props that are not valid style keys.
    const cleanProps = _.omit(this.props, 'style.activeOpacity');
    const { children, style } = cleanProps;

    return (
      <RNTouchableOpacity
        {...cleanProps}
        style={style}
        activeOpacity={activeOpacity}
      >
        {children}
      </RNTouchableOpacity>
    );
  }
}

const StyledTouchableOpacity = connectStyle('shoutem.ui.TouchableOpacity')(TouchableOpacity);

export {
  StyledTouchableOpacity as TouchableOpacity,
};
