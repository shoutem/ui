import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View as RNView } from 'react-native';

import { connectStyle } from '@shoutem/theme';
import { connectAnimation } from '@shoutem/animation';

import { LinearGradient } from '../components/LinearGradient';

class View extends Component {
  render() {
    const style = { ...this.props.style };
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
        {this.props.children}
      </RNView>
    );
  }
}

View.propTypes = {
  ...RNView.propTypes,
  style: PropTypes.object,
};

const AnimatedView = connectAnimation(View);
const StyledView = connectStyle('shoutem.ui.View')(AnimatedView);

export {
  StyledView as View,
};
