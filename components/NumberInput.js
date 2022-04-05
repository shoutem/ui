import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';
import { Button } from './Button';
import { Icon } from './Icon';
import { TextInput } from './TextInput';
import { View } from './View';

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
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  onChangeText(text) {
    const transformedText = text.replace(/[^0-9]/g, '');

    this.updateValue(parseInt(transformedText, 10));
  }

  decreaseValue() {
    const { step, value } = this.props;

    this.updateValue(value - step);
  }

  increaseValue() {
    const { step, value } = this.props;

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
      <View style={style.container} styleName="horizontal">
        <Button
          style={style.button}
          styleName="secondary"
          onPress={this.decreaseValue}
        >
          <Icon name="minus-button" style={style.icon} />
        </Button>
        <View style={style.inputContainer} styleName="horizontal">
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
          <Icon name="plus-button" style={style.icon} />
        </Button>
      </View>
    );
  }
}

NumberInput.propTypes = {
  ...TextInput.propTypes,
  style: PropTypes.object.isRequired,
  // Called when the user changes the value by inputting it directly or with buttons
  onChange: PropTypes.func.isRequired,
  // Maximum allowed value
  max: PropTypes.number,
  // Minimum allowed value
  min: PropTypes.number,
  // Step used to increase or decrease value with corresponding buttons
  step: PropTypes.number,
  // Value of the input - can be empty
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

NumberInput.defaultProps = {
  ...TextInput.defaultProps,
  max: undefined,
  min: undefined,
  step: 1,
  value: 0,
};

const AnimatedNumberInput = connectAnimation(NumberInput);
const StyledNumberInput = connectStyle('shoutem.ui.NumberInput')(
  AnimatedNumberInput,
);

export { StyledNumberInput as NumberInput };
