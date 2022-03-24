import React, { PureComponent } from 'react';
import { Animated } from 'react-native';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon } from '../Icon';
import { Text } from '../Text';
import { TouchableOpacity } from '../TouchableOpacity';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

class YearRangePickerButton extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    tooltip: PropTypes.string,
    collapsed: PropTypes.bool,
    style: PropTypes.any,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.dropDownIconValue = new Animated.Value(0);
  }

  componentDidUpdate(prevProps) {
    const { collapsed } = this.props;
    const { collapsed: prevCollapsed } = prevProps;

    if (collapsed !== prevCollapsed) {
      const toValue = collapsed ? 1 : 0;

      Animated.timing(this.dropDownIconValue, {
        toValue,
        useNativeDriver: true,
        duration: 300,
      }).start();
    }
  }

  render() {
    const { style, tooltip, onPress } = this.props;

    return (
      <TouchableOpacity onPress={onPress} style={style.container}>
        <Text>{tooltip}</Text>
        <AnimatedIcon
          name="drop-down"
          style={{
            ...style.icon,
            transform: [
              {
                rotate: this.dropDownIconValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'],
                }),
              },
            ],
          }}
        />
      </TouchableOpacity>
    );
  }
}

export default connectStyle('shoutem.ui.YearRangePickerButton')(
  YearRangePickerButton,
);
