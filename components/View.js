import React, { Component } from 'react';
import { View as RNView } from 'react-native';

import { connectStyle } from '@shoutem/theme';
import { connectAnimation } from '@shoutem/animation';

class View extends Component {
  render() {
    return (
      <RNView {...this.props} />
    );
  }
}

View.propTypes = {
  ...RNView.propTypes,
};

const AnimatedView = connectAnimation(View);
const StyledView = connectStyle('shoutem.ui.View')(AnimatedView);

export {
  StyledView as View,
};
