import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { TextInput as RNTextInput } from 'react-native';
import { connectAnimation, Wiggle } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';
import { Caption } from './Text';
import { View } from './View';

class TextInput extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      isFocused: props.highlightOnFocus && props.autoFocus,
    };
  }

  handleBlur() {
    this.setState({ isFocused: false });
  }

  handleFocus() {
    this.setState({ isFocused: true });
  }

  render() {
    const {
      errorMessage,
      highlightOnFocus,
      startErrorAnimation,
      style,
      ...otherProps
    } = this.props;
    const { isFocused } = this.state;

    const {
      errorBorderColor,
      placeholderTextColor,
      selectionColor,
      underlineColorAndroid,
      withBorder,
      withoutBorder,
      ...otherStyle
    } = style;

    const hasBorder = (isFocused && highlightOnFocus) || !!errorMessage;

    return (
      <View>
        <Wiggle startAnimation={startErrorAnimation}>
          <RNTextInput
            {...otherProps}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            placeholderTextColor={placeholderTextColor}
            selectionColor={selectionColor}
            underlineColorAndroid={underlineColorAndroid}
            style={{
              ...otherStyle,
              ...(hasBorder ? withBorder : withoutBorder),
              ...(!!errorMessage ? errorBorderColor : {}),
            }}
          />
        </Wiggle>
        {!!errorMessage && (
          <Caption styleName="form-error sm-gutter-top">{errorMessage}</Caption>
        )}
      </View>
    );
  }
}

TextInput.propTypes = {
  ...RNTextInput.propTypes,
  style: PropTypes.object,
};

const AnimatedTextInput = connectAnimation(TextInput);
const StyledTextInput = connectStyle('shoutem.ui.TextInput')(AnimatedTextInput);

export { StyledTextInput as TextInput };
