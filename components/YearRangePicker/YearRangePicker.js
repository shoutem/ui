import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import { connectStyle } from '@shoutem/theme';
import { View } from '../View';
import YearPickerButton from './YearRangePickerButton';
import YearPickerModal from './YearRangePickerModal';

function formatButtonTooltip(props) {
  const { selectedYears, buttonPlaceholder } = props;

  if (_.isEmpty(selectedYears)) {
    return buttonPlaceholder;
  }

  const leadYear = _.head(selectedYears);
  const lastYear = _.last(selectedYears);

  if (leadYear === lastYear) {
    return leadYear.toString();
  }

  return `${leadYear}-${lastYear}`;
}

class YearRangePicker extends PureComponent {
  static propTypes = {
    onRangeConfirmed: PropTypes.func,
    onReset: PropTypes.func,
    resetButtonTitle: PropTypes.string,
    confirmButtonTitle: PropTypes.string,
    selectedYears: PropTypes.arrayOf(PropTypes.number),
    rangeStart: PropTypes.number,
    rangeEnd: PropTypes.number,
    buttonPlaceholder: PropTypes.string,
  };

  static defaultProps = {
    selectedYears: [],
    buttonPlaceholder: 'Year',
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      collapsed: false,
      selectedYears: props.selectedYears,
      buttonTooltip: formatButtonTooltip(props),
    };
  }

  componentDidUpdate(prevProps) {
    const { selectedYears: prevSelectedYears } = prevProps;
    const { selectedYears } = this.props;

    if (!_.isEqual(selectedYears, prevSelectedYears)) {
      this.setState({ buttonTooltip: formatButtonTooltip(this.props) });
    }
  }

  handleButtonPressed() {
    const { collapsed } = this.state;

    this.setState({ collapsed: !collapsed });
  }

  handleRangeConfirmed(range) {
    const { onRangeConfirmed } = this.props;

    this.setState({ collapsed: false });

    if (onRangeConfirmed) {
      onRangeConfirmed(range);
    }
  }

  render() {
    const { rangeEnd, rangeStart, resetButtonTitle, confirmButtonTitle } = this.props;
    const { buttonTooltip, collapsed } = this.state;

    return (
      <View onLayout={this.handleLayout}>
        <YearPickerButton
          tooltip={buttonTooltip}
          onPress={this.handleButtonPressed}
        />
        <YearPickerModal
          visible={collapsed}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          resetButtonTitle={resetButtonTitle}
          confirmButtonTitle={confirmButtonTitle}
          onRangeConfirmed={this.handleRangeConfirmed}
          onDismiss={this.handleButtonPressed}
        />
      </View>
    );
  }
}

export default connectStyle('shoutem.ui.YearRangePicker')(YearRangePicker);
