import React, { PureComponent } from 'react';
import { TextInput as RNTextInput } from 'react-native';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
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
    const { onBlur } = this.props;

    if (onBlur) {
      onBlur();
    }

    this.setState({ isFocused: false });
  }

  handleFocus() {
    const { onFocus } = this.props;

    if (onFocus) {
      onFocus();
    }

    this.setState({ isFocused: true });
  }

  render() {
    const {
      animate,
      errorMessage,
      highlightOnFocus,
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
      wiggleAnimation,
      errorText,
      ...otherStyle
    } = style;

    const hasBorder = (isFocused && highlightOnFocus) || !!errorMessage;
    const startErrorAnimation = animate && !!errorMessage;

    return (
      <View>
        <Wiggle style={wiggleAnimation} startAnimation={startErrorAnimation}>
          <RNTextInput
            {...otherProps}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            placeholderTextColor={placeholderTextColor}
            selectionColor={selectionColor}
            underlineColorAndroid={underlineColorAndroid}
            style={{
              ...(hasBorder ? withBorder : withoutBorder),
              ...(errorMessage ? errorBorderColor : {}),
              ...otherStyle,
            }}
          />
        </Wiggle>
        {!!errorMessage && (
          <Caption styleName="form-error sm-gutter-top" style={errorText}>
            {errorMessage}
          </Caption>
        )}
      </View>
    );
  }
}

TextInput.propTypes = {
  ...RNTextInput.propTypes,
  style: PropTypes.object.isRequired,
  animate: PropTypes.bool,
  errorMessage: PropTypes.string,
};

TextInput.defaultProps = {
  animate: true,
  errorMessage: undefined,
};

const AnimatedTextInput = connectAnimation(TextInput);
const StyledTextInput = connectStyle('shoutem.ui.TextInput')(AnimatedTextInput);

export { StyledTextInput as TextInput };
