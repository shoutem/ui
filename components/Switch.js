import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';

import { TouchableWithoutFeedback } from 'react-native';

import { View } from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';
import { connectAnimation, TimingDriver } from '@shoutem/animation';

const { bool, func, object, shape } = PropTypes;

class Switch extends Component {
  static propTypes = {
    // True when switch is on, false otherwise
    value: bool,
    // Called when switch is toggled on and off
    onValueChange: func,
    // Styles for the container and underlying thumb
    style: shape({
      // Container style
      container: object,
      // Thumb style
      thumb: object,
    }),
  };

  constructor(props) {
    super(props);

    this.timingDriver = new TimingDriver();
    this.onSwitchPressed = this.onSwitchPressed.bind(this);

    this.setValue(props.value);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.value === this.props.value) {
      return;
    }

    this.setValue(nextProps.value);
  }

  onSwitchPressed() {
    const { value, onValueChange } = this.props;

    onValueChange(!value);
  }

  setValue(value) {
    this.timingDriver.toValue(value ? 1 : 0);
  }

  render() {
    const { style } = this.props;

    return (
      <TouchableWithoutFeedback
        onPress={this.onSwitchPressed}
        styleName="clear"
      >
        <View>
          <View
            animationName="mute"
            driver={this.timingDriver}
            style={style.container}
          >
            <View
              animationName="turn"
              animationOptions={{ containerWidth: style.container.width }}
              driver={this.timingDriver}
              style={style.thumb}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const AnimatedSwitch = connectAnimation(Switch);
const StyledSwitch = connectStyle('shoutem.ui.Switch')(AnimatedSwitch);

export {
  StyledSwitch as Switch,
};
