import React, { PureComponent } from 'react';
import { LayoutAnimation, ScrollView } from 'react-native';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { optionShape } from './const';
import { TabMenuItem } from './TabMenuItem';

class TabMenu extends PureComponent {
  static propTypes = {
    options: PropTypes.arrayOf(optionShape).isRequired,
    onOptionSelected: PropTypes.func,
    selectedOption: optionShape,
    style: PropTypes.object,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handleOptionSelected(option) {
    const { onOptionSelected } = this.props;

    LayoutAnimation.easeInEaseOut();
    onOptionSelected(option);
  }

  renderOption(option) {
    const { selectedOption } = this.props;

    const isSelected = selectedOption && option.title === selectedOption.title;

    return (
      <TabMenuItem
        key={option.title}
        isSelected={isSelected}
        item={option}
        onItemPressed={this.handleOptionSelected}
      />
    );
  }

  render() {
    const { style, options } = this.props;

    return (
      <ScrollView
        horizontal
        contentContainerStyle={style.container}
        showsHorizontalScrollIndicator={false}
        style={style.list}
      >
        {_.map(options, this.renderOption)}
      </ScrollView>
    );
  }
}

const StyledTabMenu = connectStyle('shoutem.ui.TabMenu')(TabMenu);

export { StyledTabMenu as TabMenu };
