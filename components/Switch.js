import React, { PureComponent } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import autoBind from 'auto-bind/react';

import { connectAnimation, TimingDriver } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

import { View } from './View';

class Switch extends PureComponent {
  static propTypes = {
    // Called when switch is toggled on and off
    onValueChange: PropTypes.func.isRequired,
    // Styles for the container and underlying thumb
    style: PropTypes.shape({
      // Container style
      container: PropTypes.object,
      // Thumb style
      thumb: PropTypes.object,
    }),
    // True when switch is on, false otherwise
    value: PropTypes.bool,
  };

  static defaultProps = {
    style: {
      container: {},
      thumb: {},
    },
    value: false,
  };

  constructor(props) {
    super(props);

    autoBind(this);

    this.timingDriver = new TimingDriver();

    this.setValue(props.value);
  }

  componentDidUpdate(prevProps) {
    const { value: currentValue } = this.props;

    if (prevProps.value !== currentValue) {
      this.setValue(currentValue);
    }
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
