import React, { PureComponent } from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import { connectStyle } from '@shoutem/theme';
import { TouchableOpacity } from '../TouchableOpacity';
import { Icon } from '../Icon';
import { Text } from '../Text';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

class YearPickerButton extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    tooltip: PropTypes.string,
    style: PropTypes.any,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.dropDownIconValue = new Animated.Value(0);

    this.state = {
      collapsed: false,
    };
  }

  handlePress() {
    const { collapsed } = this.state;
    const { onPress } = this.props;

    const toValue = collapsed ? 0 : 1;

    this.setState(
      { collapsed: !collapsed },
      () => Animated.timing(
        this.dropDownIconValue,
        {
          toValue,
          useNativeDriver: true,
          duration: 300,
        }
      ).start());

    if (onPress) {
      onPress();
    }
  }

  render() {
    const { style, tooltip } = this.props;

    return (
      <TouchableOpacity
        onPress={this.handlePress}
        style={style.container}
      >
        <Text>
          {tooltip}
        </Text>
        <AnimatedIcon
          name="drop-down"
          style={{
            ...style.icon,
            transform: [{
              rotate: this.dropDownIconValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '180deg']
              })
            }]
          }}
        />
      </TouchableOpacity>
    );
  }
}

export default connectStyle('shoutem.ui.YearPickerButton')(YearPickerButton);
