/* eslint-disable react/no-multi-comp */
import React, { forwardRef, PureComponent } from 'react';
import { Platform, TextInput as RNTextInput } from 'react-native';
import autoBindReact from 'auto-bind/react';
import { TextInputPropTypes } from 'deprecated-react-native-prop-types';
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
    this.props.onBlur()
  }

  handleFocus() {
    const { onFocus } = this.props;

    if (onFocus) {
      onFocus();
    }

    this.setState({ isFocused: true });
    this.props.onFocus()
  }
  render() {
    const {
      animate,
      errorMessage,
      highlightOnFocus,
      style,
      forwardedRef,
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
      height,
      ...otherStyle
    } = style;

    const containerStyle = Platform.OS === 'web' ? { height } : undefined;
    const hasBorder = (isFocused && highlightOnFocus) || !!errorMessage;
    const startErrorAnimation = animate && !!errorMessage;

    return (
      <View style={containerStyle}>
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
              ...otherStyle,
              ...(errorMessage ? errorBorderColor : {}),
              height,
            }}
            ref={forwardedRef}
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
  ...TextInputPropTypes,
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

const ForwardedTextInput = forwardRef((props, ref) => (
  <StyledTextInput {...props} forwardedRef={ref} />
));
ForwardedTextInput.displayName = 'TextInput';

export { ForwardedTextInput as TextInput };
