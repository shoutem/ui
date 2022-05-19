import React, { PureComponent } from 'react';
import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';
import { View } from './View';

class FormGroup extends PureComponent {
  render() {
    const { children, ...otherProps } = this.props;

    return <View {...otherProps}>{children}</View>;
  }
}

FormGroup.propTypes = {
  ...View.propTypes,
};

FormGroup.defaultProps = {
  ...View.defaultProps,
};

const AnimatedFormGroup = connectAnimation(FormGroup);
const StyledFormGroup = connectStyle('shoutem.ui.FormGroup')(AnimatedFormGroup);

export { StyledFormGroup as FormGroup };
