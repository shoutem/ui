import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
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
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      collapsed: false,
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
    const {
      rangeEnd,
      rangeStart,
      resetButtonTitle,
      confirmButtonTitle,
    } = this.props;
    const { buttonTooltip, collapsed } = this.state;

    return (
      <View>
        <YearPickerButton
          tooltip={buttonTooltip}
          onPress={this.handleButtonPressed}
          collapsed={collapsed}
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

YearRangePicker.propTypes = {
  // Disabling as this prop is used in the formatButtonTooltip function.
  // eslint-disable-next-line react/no-unused-prop-types
  buttonPlaceholder: PropTypes.string,
  confirmButtonTitle: PropTypes.string,
  rangeEnd: PropTypes.number,
  rangeStart: PropTypes.number,
  resetButtonTitle: PropTypes.string,
  selectedYears: PropTypes.arrayOf(PropTypes.number),
  onRangeConfirmed: PropTypes.func,
};

YearRangePicker.defaultProps = {
  buttonPlaceholder: 'Year',
  confirmButtonTitle: undefined,
  rangeEnd: undefined,
  rangeStart: undefined,
  resetButtonTitle: undefined,
  selectedYears: [],
  onRangeConfirmed: undefined,
};

export default connectStyle('shoutem.ui.YearRangePicker')(YearRangePicker);
