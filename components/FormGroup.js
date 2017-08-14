import React, { Component } from 'react';

import { connectStyle } from '@shoutem/theme';
import { connectAnimation } from '@shoutem/animation';

import { View } from './View';

import ViewPropTypes from 'ViewPropTypes';

class FormGroup extends Component {
  render() {
    return (
      <View {...this.props}>
        {this.props.children}
      </View>
    );
  }
}

FormGroup.propTypes = {
  ...ViewPropTypes
};

const AnimatedFormGroup = connectAnimation(FormGroup);
const StyledFormGroup = connectStyle('shoutem.ui.FormGroup')(AnimatedFormGroup);

export {
  StyledFormGroup as FormGroup,
};
