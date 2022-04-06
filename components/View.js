import React, { PureComponent } from 'react';
import { View as RNView, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';
import { LinearGradient } from './LinearGradient';

class View extends PureComponent {
  render() {
    const { children, style, ...otherProps } = this.props;
    const { backgroundGradient, ...viewStyle } = style;

    let gradient = null;
    if (backgroundGradient) {
      gradient = (
        <LinearGradient
          styleName="fill-parent"
          style={style.backgroundGradient}
        />
      );
    }

    return (
      <RNView {...otherProps} style={viewStyle}>
        {gradient}
        {children}
      </RNView>
    );
  }
}

View.propTypes = {
  ...ViewPropTypes.propTypes,
  style: PropTypes.object.isRequired,
};

const AnimatedView = connectAnimation(View);
const StyledView = connectStyle('shoutem.ui.View')(AnimatedView);

export { StyledView as View };
