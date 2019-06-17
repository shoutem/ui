import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { connectStyle } from '@shoutem/theme';
import { connectAnimation } from '@shoutem/animation';

import { Icon } from './Icon';
import { View } from './View';
import { Button } from './Button';
import { TextInput } from './TextInput';

const { func, number, object, oneOfType, shape, string } = PropTypes;

/**
 * A component for entering a numerical value with two helper buttons for increasing
 * and decreasing the value.
 *
 * The current implementation allows only positive integers. It removes any character
 * that is not a digit, if the user enters it directly or by pasting.
 *
 * The component allows empty values. The consumer needs to handle it as he sees fit.
 *
 * TODO: Future implementations should define how to handle validation in combination with
 * focus and blur events.
 */
class NumberInput extends PureComponent {
  static propTypes = {
    ...TextInput.propTypes,
    // Maximum allowed value
    max: number,
    // Minimum allowed value
    min: number,
    // Called when the user changes the value by inputting it directly or with buttons
    onChange: func.isRequired,
    // Step used to increase or decrease value with corresponding buttons
    step: number,
    // Styles for component parts
    style: shape({
      button: object,
      container: object,
      icon: object,
      input: object,
      inputContainer: object,
    }),
    // Value of the input - can be empty
    value: oneOfType([
      number,
      string,
    ]),
  };

  constructor(props) {
    super(props);

    this.decreaseValue = this.decreaseValue.bind(this);
    this.increaseValue = this.increaseValue.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
  }

  onChangeText(text) {
    const transformedText = text.replace(/[^0-9]/g, '');

    this.updateValue(parseInt(transformedText, 10));
  }

  decreaseValue() {
    const { step = 1, value = 0 } = this.props;

    this.updateValue(value - step);
  }

  increaseValue() {
    const { step = 1, value = 0 } = this.props;

    this.updateValue(value + step);
  }

  updateValue(value) {
    const { max, min, onChange } = this.props;

    if (!_.isFinite(value)) {
      return onChange('');
    }

    let newValue = _.isFinite(max) && value > max ? max : value;
    newValue = _.isFinite(min) && newValue < min ? min : newValue;

    return onChange(newValue);
  }

  render() {
    const { style, value } = this.props;

    return (
      <View
        style={style.container}
        styleName="horizontal"
      >
        <Button
          style={style.button}
          styleName="secondary"
          onPress={this.decreaseValue}
        >
          <Icon
            name="minus-button"
            style={style.icon}
          />
        </Button>
        <View
          style={style.inputContainer}
          styleName="horizontal"
        >
          <TextInput
            keyboardType="numeric"
            onChangeText={this.onChangeText}
            style={style.input}
            value={`${value}`}
          />
        </View>
        <Button
          style={style.button}
          styleName="secondary"
          onPress={this.increaseValue}
        >
          <Icon
            name="plus-button"
            style={style.icon}
          />
        </Button>
      </View>
    );
  }
}

const AnimatedNumberInput = connectAnimation(NumberInput);
const StyledNumberInput = connectStyle('shoutem.ui.NumberInput')(AnimatedNumberInput);

export {
  StyledNumberInput as NumberInput,
};
