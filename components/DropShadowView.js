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
function DropShadowView({ children, ...otherProps }) {
  return <DropShadow {...otherProps}>{children}</DropShadow>;
}

DropShadowView.propTypes = {
  ...ViewPropTypes,
  children: PropTypes.node.isRequired,
};

const AnimatedView = connectAnimation(DropShadowView);
const StyledView = connectStyle('shoutem.ui.DropShadowView')(AnimatedView);

export { StyledView as DropShadowView };
