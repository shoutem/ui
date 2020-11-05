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
      isFocused: props.highlightWhenFocused && props.autoFocus,
    };
  }

  handleFocus() {
    this.setState({ isFocused: true });
  }

  handleBlur() {
    this.setState({ isFocused: false });
  }

  resolveProps() {
    const { highlightWhenFocused, errorMessage, style } = this.props;
    const { isFocused } = this.state;

    let resolvedStyle = {
      ...style,
      borderWidth: (isFocused || !!errorMessage) ? 1 : 0,
    }

    if (!!errorMessage) {
      resolvedStyle.borderColor = style.errorBorderColor;
    }

    delete resolvedStyle.placeholderTextColor;
    delete resolvedStyle.selectionColor;
    delete resolvedStyle.underlineColorAndroid;

    if (highlightWhenFocused) {
      return {
        onFocus: () => this.handleFocus(),
        onBlur: () => this.handleBlur(),
        style: resolvedStyle,
      };
    }

    return { style: resolvedStyle };
  }

  render() {
    const { errorMessage, style } = this.props;

    return (
      <View>
        <RNTextInput
          {...this.props}
          {...this.resolveProps()}
          placeholderTextColor={style.placeholderTextColor}
          selectionColor={style.selectionColor}
          underlineColorAndroid={style.underlineColorAndroid}
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
  highlightWhenFocused: PropTypes.bool,
  errorMessage: PropTypes.string,
};

const AnimatedTextInput = connectAnimation(TextInput);
const StyledTextInput = connectStyle('shoutem.ui.TextInput')(AnimatedTextInput);

export {
  StyledTextInput as TextInput,
};
