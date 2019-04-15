import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { TextInput as RNTextInput } from 'react-native';

import { connectStyle } from '@shoutem/theme';
import { connectAnimation } from '@shoutem/animation';

class TextInput extends PureComponent {
  render() {
    const { props } = this;
    const style = {
      ...props.style,
    };
    delete style.placeholderTextColor;
    delete style.selectionColor;
    delete style.underlineColorAndroid;

    return (
      <RNTextInput
        {...props}
        style={style}
        placeholderTextColor={props.style.placeholderTextColor}
        selectionColor={props.style.selectionColor}
        underlineColorAndroid={props.style.underlineColorAndroid}
      />
    );
  }
}

TextInput.propTypes = {
  ...RNTextInput.propTypes,
  style: PropTypes.object,
};

const AnimatedTextInput = connectAnimation(TextInput);
const StyledTextInput = connectStyle('shoutem.ui.TextInput')(AnimatedTextInput);

export {
  StyledTextInput as TextInput,
};
