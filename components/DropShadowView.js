import React from 'react';
import { ViewPropTypes } from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import PropTypes from 'prop-types';
import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

/**
 * Component adds support for shadow styles on Android
 * that behave the same way as on iOS.
 */
function DropShadowView({ children, style, ...otherProps }) {
  return (
    <DropShadow style={style} {...otherProps}>
      {children}
    </DropShadow>
  );
}

DropShadowView.propTypes = {
  ...ViewPropTypes,
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};

DropShadowView.defaultProps = {
  style: {},
};

const AnimatedView = connectAnimation(DropShadowView);
const StyledView = connectStyle('shoutem.ui.DropShadowView')(AnimatedView);

export { StyledView as DropShadowView };
