import React, { PureComponent } from 'react';
import RNCDateTimePicker from '@react-native-community/datetimepicker';
import autoBindReact from 'auto-bind/react';
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
    const { textValue } = this.props;
    const { showPicker, value } = this.state;

    return (
      <View styleName="horizontal">
        <TouchableOpacity
          onPress={this.handleShowPicker}
          styleName="flexible md-gutter"
          style={{
            padding: 15,
            borderColor: '#C2C2C2',
            borderWidth: 1,
          }}
        >
          <Text> {textValue}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.handleShowPicker}
          style={{
            width: 50,
            height: 50,
            backgroundColor: '#222222',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon
            name="drop-down"
            style={{ color: '#FFFFFF', height: 30, width: 30 }}
          />
        </TouchableOpacity>
        <Modal
          backdropOpacity={0.5}
          isVisible={showPicker}
          hasBackdrop
          onBackdropPress={this.handleHidePicker}
        >
          <View styleName="md-gutter" style={{ backgroundColor: '#FFFFFF' }}>
            <RNCDateTimePicker
              mode="time"
              value={value}
              is24Hour={false}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={this.handleValueChanged}
            />
            <View style={{ height: 80 }} styleName="md-gutter-top">
              <Button
                style={{ width: 100, margin: 'auto' }}
                onPress={this.handleConfirmPress}
              >
                <Text>CONFIRM</Text>
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const StyledDateTimePicker = connectStyle('shoutem.ui.DateTimePicker')(
  DateTimePicker,
);

export { StyledDateTimePicker as DateTimePicker };
