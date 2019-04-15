import React, { PureComponent } from 'react';

import { connectStyle } from '@shoutem/theme';
import { connectAnimation } from '@shoutem/animation';

import { View } from './View';

class FormGroup extends PureComponent {
  render() {
    return (
      <View {...this.props}>
        {this.props.children}
      </View>
    );
  }
}

FormGroup.propTypes = {
  ...View.propTypes,
};

const AnimatedFormGroup = connectAnimation(FormGroup);
const StyledFormGroup = connectStyle('shoutem.ui.FormGroup')(AnimatedFormGroup);

export {
  StyledFormGroup as FormGroup,
};
