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

    this.scroll = {};

    autoBindReact(this);

    this.state = {
      itemWidths: {},
      viewportHorizontal: [],
    };
  }

  componentDidMount() {
    this.scrollToSelectedItem();
  }

  componentDidUpdate(prevProps) {
    const { selectedOption } = this.props;

    if (prevProps.selectedOption !== selectedOption) {
      this.scrollToSelectedItem();
    }
  }

  scrollToSelectedItem() {
    const { selectedOption, options } = this.props;
    const { itemWidths, viewportHorizontal } = this.state;

    if (!selectedOption || !options.length || !this.scroll) {
      return;
    }

    const selectedIndex = options.findIndex(
      option => option.id === selectedOption.id,
    );

    if (selectedIndex === -1) {
      return;
    }

    let itemStart = 0;

    _.forEach(itemWidths, (itemWidth, index) => {
      if (index < selectedIndex) {
        itemStart += itemWidth;
      }
    });

    const itemEnd = itemStart + itemWidths[selectedIndex];

    // Ensure item is in view
    if (itemEnd > _.last(viewportHorizontal)) {
      const extraScroll = itemEnd - _.last(viewportHorizontal);
      this.scroll.scrollTo({ x: extraScroll, y: 0, animated: true });
    }

    if (itemStart < _.head(viewportHorizontal)) {
      this.scroll.scrollTo({
        x: itemStart,
        y: 0,
        animated: true,
      });
    }
  }

  handleScroll({
    nativeEvent: {
      contentOffset: { x },
      layoutMeasurement: { width },
    },
  }) {
    this.setState({ viewportHorizontal: [x, width] });
  }

  handleScrollLayout({
    nativeEvent: {
      layout: { width },
    },
  }) {
    this.setState({ viewportHorizontal: [0, width] });
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

  handleOptionSelected(option) {
    const { onOptionSelected } = this.props;

    LayoutAnimation.easeInEaseOut();
    onOptionSelected(option);
  }

  renderOption(option, key) {
    const { selectedOption } = this.props;

    const isSelected = selectedOption && option.title === selectedOption.title;

    return (
      <TabMenuItem
        key={key}
        isSelected={isSelected}
        item={option}
        onItemPressed={option => this.handleOptionSelected(option)}
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
        scrollEventThrottle={16}
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
