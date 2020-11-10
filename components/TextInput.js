import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { TextInput as RNTextInput } from 'react-native';

import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

import { Caption } from './Text';
import { View } from './View';

// Style properties defined in theme which would case a warning if passed to a components style prop
const omittedStyleProperties = [
  'errorBorder',
  'placeholderTextColor',
  'selectionColor',
  'underlineColorAndroid',
  'withBorder',
  'withoutBorder',
];

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
    const { errorMessage, highlightOnFocus, style } = this.props;
    const { isFocused } = this.state;

    return (
      <View>
        <RNTextInput
          {..._.omit(this.props, 'style')}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          placeholderTextColor={style.placeholderTextColor}
          selectionColor={style.selectionColor}
          underlineColorAndroid={style.underlineColorAndroid}
          style={[
            _.omit(style, omittedStyleProperties),
            (isFocused && highlightOnFocus) ? style.withBorder : style.withoutBorder,
            !!errorMessage && style.errorBorder,
          ]}
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
