import React, { PureComponent } from 'react';
import RNCDateTimePicker from '@react-native-community/datetimepicker';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import Modal from 'react-native-modal';
import { connectStyle } from '@shoutem/theme';
import { Icon } from './Icon';
import { Text } from './Text';
import { TouchableOpacity } from './TouchableOpacity';
import { View } from './View';
import { Button } from './Button';

class DateTimePicker extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      showPicker: false,
      value: props.value,
    };
  }

  handleValueChanged(event, value) {
    this.setState({ value });
  }

  handleShowPicker() {
    this.setState({ showPicker: true });
  }

  handleHidePicker() {
    this.setState({ showPicker: false });
  }

  handleConfirmPress() {
    const { onValueChanged } = this.props;
    const { value } = this.state;

    onValueChanged(value);
    this.handleHidePicker();
  }

  render() {
    const { confirmButtonText, is24Hour, mode, textValue, style } = this.props;
    const { showPicker, value } = this.state;

    return (
      <View styleName="horizontal">
        <TouchableOpacity
          styleName="flexible md-gutter"
          style={style.textContainer}
          onPress={this.handleShowPicker}
        >
          <Text> {textValue}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.handleShowPicker}
          styleName="h-center v-center"
          style={style.buttonContainer}
        >
          <Icon name="drop-down" style={style.icon} />
        </TouchableOpacity>
        <Modal
          backdropOpacity={0.5}
          isVisible={showPicker}
          hasBackdrop
          onBackdropPress={this.handleHidePicker}
        >
          <View styleName="md-gutter" style={style.modalContainer}>
            <RNCDateTimePicker
              mode={mode}
              value={value}
              is24Hour={is24Hour}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={this.handleValueChanged}
            />
            <View style={style.modalButtonContainer} styleName="md-gutter-top">
              <Button
                style={style.modalButton}
                onPress={this.handleConfirmPress}
              >
                <Text>{confirmButtonText}</Text>
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

DateTimePicker.propTypes = {
  confirmButtonText: PropTypes.string,
  is24Hour: PropTypes.bool,
  mode: PropTypes.string,
  onValueChanged: PropTypes.func,
  textValue: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
};

DateTimePicker.defaultProps = {
  confirmButtonText: 'Confirm',
  is24Hour: false,
  mode: 'datetime',
  value: new Date(),
};

const StyledDateTimePicker = connectStyle('shoutem.ui.DateTimePicker')(
  DateTimePicker,
);

export { StyledDateTimePicker as DateTimePicker };
