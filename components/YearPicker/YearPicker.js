import React, { PureComponent } from 'react';
import { Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import YearPickerButton from './YearPickerButton';
import YearPickerModal from './YearPickerModal';

const window = Dimensions.get('window');

function formatButtonTooltip(props) {
  const { selectedYears } = props;

  if (_.isEmpty(selectedYears)) {
    return '-';
  }

  const leadYear = _.head(selectedYears);
  const lastYear = _.last(selectedYears);

  if (leadYear === lastYear) {
    return leadYear.toString();
  }

  return `${leadYear}-${lastYear}`;
}

class YearPicker extends PureComponent {
  static propTypes = {
    onRangeConfirmed: PropTypes.func,
    onReset: PropTypes.func,
    resetButtonTitle: PropTypes.string,
    confirmButtonTitle: PropTypes.string,
    selectedYears: PropTypes.arrayOf(PropTypes.number),
    rangeStart: PropTypes.number,
    rangeEnd: PropTypes.number,
  };

  static defaultProps = {
    selectedYears: [],
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

  handleButtonPressed() {
    const { collapsed } = this.state;

    this.setState({ collapsed: !collapsed });
  }

  handleLayout({ nativeEvent: { layout: { x, y, width, height } } }) {
    this.setState({
      modalStyle: {
        position: 'absolute',
        top: 4 + height,
        left: 0,
        width: window.width - (2 * x),
      }
    });
  }

  render() {
    const { rangeEnd, rangeStart, resetButtonTitle, confirmButtonTitle } = this.props;
    const { buttonTooltip, collapsed, modalStyle } = this.state;

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
          containerStyle={modalStyle}
          resetButtonTitle={resetButtonTitle}
          confirmButtonTitle={confirmButtonTitle}
        />
      </View>
    );
  }
}

export default connectStyle('shoutem.ui.YearPicker')(YearPicker);
