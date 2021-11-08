import React, { PureComponent } from 'react';
import RNCDateTimePicker from '@react-native-community/datetimepicker';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import Modal from 'react-native-modal';
import { connectStyle } from '@shoutem/theme';
import { Button } from './Button';
import { Icon } from './Icon';
import { Text } from './Text';
import { TouchableOpacity } from './TouchableOpacity';
import { View } from './View';

const isIos = Platform.OS === 'ios';

const MODES = { DATE: 'date', DATETIME: 'datetime', TIME: 'time' };

const DISPLAY_MODES = {
  [MODES.DATE]: 'inline',
  [MODES.DATETIME]: 'inline',
  [MODES.TIME]: 'spinner',
};

function getDisplayMode(mode) {
  if (!isIos || !Object.keys(DISPLAY_MODES).includes(mode)) {
    return 'default';
  }

  return DISPLAY_MODES[mode];
}

class DateTimePicker extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    const { mode, value } = props;

    this.state = {
      display: getDisplayMode(mode),
      showPicker: false,
      showTimePicker: false,
      value,
    };
  }

  componentDidUpdate() {
    // todo: check why set state here
    if (!isIos) {
      const { value } = this.props;

      this.setState({ value });
    }
  }

  handleValueChanged(event, value) {
    if (isIos) {
      return this.setState({ value });
    }

    if (event.type === 'dismissed') {
      return this.handleHidePicker();
    }

    const { mode, onValueChanged } = this.props;

    const showTimePicker = mode === MODES.DATETIME;

    this.setState({ value, showPicker: false, showTimePicker });
    return !showTimePicker && onValueChanged(value);
  }

  handleTimeValueChanged(event, selectedValue) {
    if (event.type === 'dismissed') {
      return this.handleHidePicker();
    }

    const { onValueChanged } = this.props;
    const { value } = this.state;

    // Time picker value will override preselected date
    // Use current date from state and only set hours & minutes
    const currentDate = new Date(value);
    const selectedDate = new Date(selectedValue);
    const hour = selectedDate.getHours();
    const minutes = selectedDate.getMinutes();

    currentDate.setHours(hour, minutes, 0);

    this.setState({ value: currentDate, showTimePicker: false });
    return onValueChanged(currentDate);
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
    const {
      cancelButtonText,
      confirmButtonText,
      is24Hour,
      mode,
      textValue,
      style,
      ...otherProps
    } = this.props;
    const { display, showPicker, showTimePicker, value } = this.state;

    return (
      <View styleName="horizontal">
        <TouchableOpacity
          styleName="flexible md-gutter"
          style={style.textContainer}
          onPress={this.handleShowPicker}
        >
          <Text>{textValue}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.handleShowPicker}
          styleName="h-center v-center"
          style={style.buttonContainer}
        >
          <Icon name="drop-down" style={style.icon} />
        </TouchableOpacity>
        {isIos && (
          <Modal
            backdropOpacity={0.5}
            isVisible={showPicker}
            hasBackdrop
            onBackdropPress={this.handleHidePicker}
            swipeDirection={['left', 'right']}
            swipeThreshold={20}
            onSwipeComplete={this.handleHidePicker}
          >
            <View styleName="md-gutter" style={style.modalContainer}>
              <RNCDateTimePicker
                display={display}
                is24Hour={is24Hour}
                mode={mode}
                onChange={this.handleValueChanged}
                textColor="light"
                themeVariant="light"
                value={value}
                {...otherProps}
              />
              <View
                style={style.modalButtonContainer}
                styleName="horizontal md-gutter-top"
              >
                <Button
                  style={style.modalButton}
                  onPress={this.handleHidePicker}
                >
                  <Text>{cancelButtonText}</Text>
                </Button>
                <Button
                  style={style.modalButton}
                  onPress={this.handleConfirmPress}
                >
                  <Text>{confirmButtonText}</Text>
                </Button>
              </View>
            </View>
          </Modal>
        )}
        {!isIos && showPicker && (
          <RNCDateTimePicker
            display={display}
            is24Hour={is24Hour}
            mode={mode}
            onChange={this.handleValueChanged}
            value={value}
            {...otherProps}
          />
        )}
        {!isIos && !showPicker && showTimePicker && (
          <RNCDateTimePicker
            display={display}
            is24Hour={is24Hour}
            mode="time"
            onChange={this.handleTimeValueChanged}
            value={value}
            {...otherProps}
          />
        )}
      </View>
    );
  }
}

DateTimePicker.propTypes = {
  cancelButtonText: PropTypes.string,
  confirmButtonText: PropTypes.string,
  is24Hour: PropTypes.bool,
  mode: PropTypes.oneOf(Object.values(MODES)),
  onValueChanged: PropTypes.func,
  textValue: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
};

DateTimePicker.defaultProps = {
  cancelButtonText: 'Cancel',
  confirmButtonText: 'Confirm',
  is24Hour: false,
  mode: 'datetime',
  value: new Date(),
};

const StyledDateTimePicker = connectStyle('shoutem.ui.DateTimePicker')(
  DateTimePicker,
);

export { StyledDateTimePicker as DateTimePicker };
