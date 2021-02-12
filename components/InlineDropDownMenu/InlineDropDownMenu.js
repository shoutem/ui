import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import { FlatList, Animated } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { TouchableOpacity } from '../TouchableOpacity';
import { View } from '../View';
import { Caption, Text } from '../Text';
import { Icon } from '../Icon';
import { InlineDropDownMenuItem } from './InlineDropDownMenuItem';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const optionShape = PropTypes.shape({
  title: PropTypes.string,
  key: PropTypes.string,
});

class InlineDropDownMenu extends PureComponent {
  static propTypes = {
    heading: PropTypes.string,
    selectedDescriptor: PropTypes.string,
    options: PropTypes.arrayOf(optionShape).isRequired,
    onOptionSelected: PropTypes.func,
    selectedOption: optionShape,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.dropDownIconValue = new Animated.Value(0);

    this.state = {
      collapsed: false,
    };
  }

  handleToggleMenuPress() {
    const { collapsed } = this.state;

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
  }

  handleOptionPress(option) {
    const { onOptionSelected } = this.props;

    if (onOptionSelected) {
      onOptionSelected(option);
    }

    this.handleToggleMenuPress();
  }

  renderOption({ item, index }) {
    const { selectedOption, selectedDescriptor } = this.props;

    const isSelected = selectedOption.key === item.key;

    return (
      <InlineDropDownMenuItem
        item={item}
        isSelected={isSelected}
        index={index}
        selectedDescriptor={selectedDescriptor}
        onItemPressed={this.handleOptionPress}
      />
    )
  }

  render() {
    const {
      style,
      heading,
      selectedOption,
      options,
    } = this.props;
    const { collapsed } = this.state;

    return (
      <View>
        <TouchableOpacity style={style.container} onPress={this.handleToggleMenuPress}>
          <Caption styleName="muted md-gutter-bottom">{heading}</Caption>
          <View styleName="space-between horizontal v-center">
            <Text>{selectedOption?.title}</Text>
            <AnimatedIcon
              name="drop-down"
              styleName="md-gutter-left"
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
          </View>
        </TouchableOpacity>
        {collapsed && (
          <FlatList
            data={options}
            renderItem={this.renderOption}
            contentContainerStyle={style.list}
          />
        )}
      </View>
    );
  }
}

const StyledComponent = connectStyle('shoutem.ui.InlineDropDownMenu')(
  InlineDropDownMenu,
);

export { StyledComponent as InlineDropDownMenu };
