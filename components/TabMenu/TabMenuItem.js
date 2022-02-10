import React, { PureComponent } from 'react';
import { LayoutAnimation } from 'react-native';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text } from '../Text';
import { TouchableOpacity } from '../TouchableOpacity';
import { View } from '../View';
import { optionShape } from './const';

class TabMenuItem extends PureComponent {
  static propTypes = {
    item: optionShape,
    onItemPressed: PropTypes.any,
    isSelected: PropTypes.bool,
    style: PropTypes.object,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      baseWidth: 0,
    };
  }

  handleItemPressed() {
    const { onItemPressed, item } = this.props;

    onItemPressed(item);
  }

  handleLayout({
    nativeEvent: {
      layout: { width },
    },
  }) {
    LayoutAnimation.easeInEaseOut();
    this.setState({ baseWidth: width });
  }

  render() {
    const { style, isSelected, item } = this.props;
    const { baseWidth } = this.state;

    return (
      <TouchableOpacity
        onPress={this.handleItemPressed}
        styleName="vertical h-center"
      >
        <Text
          style={[style.text, isSelected && style.selectedText]}
          onLayout={this.handleLayout}
        >
          {item.title}
        </Text>
        {isSelected && <View style={[style.tabulator, { width: baseWidth }]} />}
      </TouchableOpacity>
    );
  }
}

const StyledTabMenuItem = connectStyle('shoutem.ui.TabMenuItem')(TabMenuItem);

export { StyledTabMenuItem as TabMenuItem };
