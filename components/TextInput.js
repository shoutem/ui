import PropTypes from 'prop-types';
import React, { PureComponent, forwardRef } from 'react';
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
        ref={props.forwardedRef}
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
const ForwardedTextInput = forwardRef((props, forwardedRef) => (
  <StyledTextInput {...props} forwardedRef={forwardedRef} />
))

export {
  ForwardedTextInput as TextInput,
};
