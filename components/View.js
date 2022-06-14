import React, { PureComponent } from 'react';
import { View as RNView, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';
import { LinearGradient } from './LinearGradient';

class View extends PureComponent {
  render() {
    const { children, style } = this.props;
    const { backgroundGradient, ...viewStyle } = style;

    let gradient = null;
    if (backgroundGradient) {
      gradient = (
        <LinearGradient styleName="fill-parent" style={backgroundGradient} />
      );
    }

    return (
      <RNView {...this.props} style={viewStyle}>
        {gradient}
        {children}
      </RNView>
    );
  }
}

View.propTypes = {
  ...ViewPropTypes,
  style: PropTypes.object.isRequired,
};

const AnimatedView = connectAnimation(View);
const StyledView = connectStyle('shoutem.ui.View')(AnimatedView);

export { StyledView as View };
