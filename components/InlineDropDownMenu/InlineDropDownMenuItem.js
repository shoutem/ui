import React, { PureComponent } from 'react';
import { Animated, Dimensions } from 'react-native';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text } from '../Text';
import { TouchableOpacity } from '../TouchableOpacity';

const window = Dimensions.get('window');
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

class InlineDropDownMenuItem extends PureComponent {
  static propTypes = {
    item: PropTypes.object,
    index: PropTypes.number,
    selectedDescriptor: PropTypes.string,
    onItemPressed: PropTypes.func,
    isSelected: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.animatedValue = new Animated.Value(0);
  }

  componentDidMount() {
    const { index } = this.props;

    Animated.timing(this.animatedValue, {
      toValue: 1,
      useNativeDriver: true,
      duration: 300 + index * 15,
    }).start();
  }

  handlePress() {
    const { onItemPressed, item } = this.props;

    if (onItemPressed) {
      onItemPressed(item);
    }
  }

  render() {
    const { isSelected, selectedDescriptor, item, style } = this.props;

    const resolvedText = isSelected
      ? `${item.title} (${selectedDescriptor})`
      : item.title;
    const textStyle = isSelected ? 'muted' : '';

    return (
      <AnimatedTouchable
        style={[
          style.container,
          {
            transform: [
              {
                translateX: this.animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [window.width, 0],
                }),
              },
            ],
          },
        ]}
        disabled={isSelected}
        onPress={this.handlePress}
      >
        <Text styleName={textStyle}>{resolvedText}</Text>
      </AnimatedTouchable>
    );
  }
}

const StyledComponent = connectStyle('shoutem.ui.InlineDropDownMenuItem')(
  InlineDropDownMenuItem,
);

export { StyledComponent as InlineDropDownMenuItem };
