import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { TextInput as RNTextInput } from 'react-native';

import { connectAnimation } from '@shoutem/animation';
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
        <RNTextInput
          {...otherProps}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          placeholderTextColor={style.placeholderTextColor}
          selectionColor={style.selectionColor}
          underlineColorAndroid={style.underlineColorAndroid}
          style={{
            ...otherStyle,
            ...(hasBorder ? style.withBorder : style.withoutBorder),
            ...(!!errorMessage ? style.errorBorderColor : {}),
          }}
        />
        {!!errorMessage &&
          <Caption styleName="form-error sm-gutter-top">
            {errorMessage}
          </Caption>
        }
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

export {
  StyledTextInput as TextInput,
};
