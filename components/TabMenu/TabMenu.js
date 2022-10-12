import React, { PureComponent } from 'react';
import { LayoutAnimation, ScrollView } from 'react-native';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { optionShape } from './const';
import { TabMenuItem } from './TabMenuItem';

class TabMenu extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      itemWidths: {},
      scrollOffset: 0,
    };
  }

  handleOptionSelected(key, option) {
    const { onOptionSelected } = this.props;
    const { scrollOffset, itemWidths, viewportHorizontal } = this.state;

    let itemStart = 0;

    _.forEach(itemWidths, (itemWidth, index) => {
      if (index < key) {
        itemStart += itemWidth;
      }
    });

    const itemEnd = itemStart + itemWidths[key];

    LayoutAnimation.easeInEaseOut();
    onOptionSelected(option);

    if (itemEnd > _.last(viewportHorizontal)) {
      const extraScroll = itemEnd - _.last(viewportHorizontal);

      this.scroll.scrollTo({
        x: extraScroll + scrollOffset,
        y: 0,
        animated: true,
      });
    }

    if (itemStart < _.head(viewportHorizontal)) {
      const extraScroll = _.head(viewportHorizontal) - itemStart;

      this.scroll.scrollTo({
        x: scrollOffset - extraScroll,
        y: 0,
        animated: true,
      });
    }
  }

  handleItemLayout(key, width) {
    const { itemWidths } = this.state;

    this.setState({
      itemWidths: {
        ...itemWidths,
        [key]: width,
      },
    });
  }

  handleScroll({
    nativeEvent: {
      contentOffset: { x },
      layoutMeasurement: { width },
    },
  }) {
    this.setState({ scrollOffset: x, viewportHorizontal: [x, x + width] });
  }

  handleScrollLayout({
    nativeEvent: {
      layout: { width },
    },
  }) {
    this.setState({ viewportHorizontal: [0, width] });
  }

  renderOption(option, key) {
    const { selectedOption } = this.props;

    const isSelected = selectedOption && option.title === selectedOption.title;

    return (
      <TabMenuItem
        key={key}
        isSelected={isSelected}
        item={option}
        onItemPressed={option => this.handleOptionSelected(key, option)}
        onLayoutMeasured={width => this.handleItemLayout(key, width)}
      />
    );
  }

  render() {
    const { style, options } = this.props;

    return (
      <ScrollView
        horizontal
        contentContainerStyle={style.container}
        onScroll={this.handleScroll}
        onLayout={this.handleScrollLayout}
        ref={ref => {
          this.scroll = ref;
        }}
        showsHorizontalScrollIndicator={false}
        style={style.list}
      >
        {_.map(options, this.renderOption)}
      </ScrollView>
    );
  }
}

TabMenu.propTypes = {
  options: PropTypes.arrayOf(optionShape).isRequired,
  style: PropTypes.object.isRequired,
  selectedOption: optionShape,
  onOptionSelected: PropTypes.func,
};

TabMenu.defaultProps = {
  selectedOption: undefined,
  onOptionSelected: undefined,
};

const StyledTabMenu = connectStyle('shoutem.ui.TabMenu')(TabMenu);

export { StyledTabMenu as TabMenu };
