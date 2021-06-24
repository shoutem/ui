import React, { PureComponent } from 'react';
import RNCDateTimePicker from '@react-native-community/datetimepicker';
import autoBindReact from 'auto-bind/react';
import { Platform } from 'react-native';
import { connectStyle } from '@shoutem/theme';
import { Icon } from './Icon';
import { Text } from './Text';
import { TouchableOpacity } from './TouchableOpacity';
import { View } from './View';

class DateTimePicker extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      showPicker: false,
    };
  }

  handleOpenPicker() {
    const { showPicker } = this.state;
    this.setState({ showPicker: !showPicker });
  }

  handleTimeSelected(time) {
    console.log(time)
    this.setState({showPicker: false})
  }

  render() {
    const { showPicker } = this.state;
    console.log(showPicker)

    return (
      <View styleName="horizontal">
        <TouchableOpacity
          onPress={this.handleOpenPicker}
          styleName="flexible md-gutter"
          style={{
            padding: 15,
            borderColor: '#C2C2C2',
            borderWidth: 1,
          }}
        >
          <Text> 10:30 AM </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.handleOpenPicker}
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
      </View>
      // {showPicker && (
      //   <View style={{ position:'absolute', zIndex: 500, width: 500, height: 500, borderColor: 'red', borderWidth: 2}}>
      //     <RNCDateTimePicker
      //       mode="time"
      //       value={new Date()}
      //       is24Hour={false}
      //       display={Platform.OS === 'ios' ? 'compact' : 'default'}
      //       onChange={this.handleTimeSelected}
      //     />
      //   </View>
      // )}
    );
  }
}

const StyledDateTimePicker = connectStyle('shoutem.ui.DateTimePicker')(DateTimePicker);
export { StyledDateTimePicker as DateTimePicker };
