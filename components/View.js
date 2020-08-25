import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  View as RNView,
  ViewPropTypes,
} from 'react-native';

import { connectStyle } from '@shoutem/theme';
import { connectAnimation } from '@shoutem/animation';

import { LinearGradient } from './LinearGradient';

class View extends PureComponent {
  static propTypes = {
    ...ViewPropTypes,
    style: PropTypes.object,
  };

  static defaultProps = {
    style: {},
  };

  render() {
    const { children, style } = this.props;

    let gradient = null;
    if (style.backgroundGradient) {
      gradient = (
        <LinearGradient
          styleName="fill-parent"
          style={style.backgroundGradient}
        />
      );

      // This is not a valid RN View style
      delete style.backgroundGradient;
    }


    return (
      <RNView {...this.props} style={style}>
        {gradient}
        {children}
      </RNView>
    );
  }
}

const AnimatedView = connectAnimation(View);
const StyledView = connectStyle('shoutem.ui.View')(AnimatedView);

export {
  StyledView as View,
};
