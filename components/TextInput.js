import React, { PureComponent } from 'react';
import { TextInput as RNTextInput } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

class TextInput extends PureComponent {
  static propTypes = {
    ...RNTextInput.propTypes,
    style: PropTypes.object,
  };

  static defaultProps = {
    style: {},
  };

  render() {
    const { style: { placeholderTextColor, selectionColor, underlineColorAndroid } } = this.props;
    // Remove the props that are not valid style keys.
    const cleanProps = _.omit(
      this.props,
      ['style.placeholderTextColor', 'style.selectionColor', 'style.underlineColorAndroid'],
    );
    const { style } = cleanProps;

    return (
      <RNTextInput
        {...cleanProps}
        style={style}
        placeholderTextColor={placeholderTextColor}
        selectionColor={selectionColor}
        underlineColorAndroid={underlineColorAndroid}
      />
    );
  }
}

const AnimatedTextInput = connectAnimation(TextInput);
const StyledTextInput = connectStyle('shoutem.ui.TextInput')(AnimatedTextInput);

export {
  StyledTextInput as TextInput,
};
