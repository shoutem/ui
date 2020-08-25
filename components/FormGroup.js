import React, { PureComponent } from 'react';

import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

import { View } from './View';

class FormGroup extends PureComponent {
  static propTypes = {
    ...View.propTypes,
  };

  render() {
    const { children } = this.props;

    return (
      <View {...this.props}>
        {children}
      </View>
    );
  }
}

const AnimatedFormGroup = connectAnimation(FormGroup);
const StyledFormGroup = connectStyle('shoutem.ui.FormGroup')(AnimatedFormGroup);

export {
  StyledFormGroup as FormGroup,
};
