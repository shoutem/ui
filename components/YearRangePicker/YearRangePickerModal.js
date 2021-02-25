import React, { PureComponent } from 'react';
import { LayoutAnimation } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import { connectStyle } from '@shoutem/theme';
import { View } from '../View';
import { Text } from '../Text';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { TouchableOpacity } from '../TouchableOpacity';

const NUMBER_OF_ROWS = 4;
const YEARS_IN_ROW = 5;

function resolveVisibleYears(props) {
  const { selectedYears, rangeStart, rangeEnd } = props;

  const yearsPerPage = NUMBER_OF_ROWS * YEARS_IN_ROW;

  if (_.isEmpty(selectedYears)) {
    const fullRange = _.times(
      yearsPerPage,
      index => rangeStart + index,
    );

    return _.filter(fullRange, year => year <= rangeEnd);
  }

  const firstSelectedYear = _.head(selectedYears);
  const prevPagesNumber = Math.trunc(firstSelectedYear / yearsPerPage);

  const fullRangeStart = (prevPagesNumber * yearsPerPage) + 1;
  const fullRange = _.times(
    yearsPerPage,
    index => fullRangeStart + index,
  );

  return _.filter(fullRange, year => year <= rangeEnd);
}

function resolveRangeTooltip(visibleYears) {
  const startYear = _.head(visibleYears).toString();
  const endYear = _.last(visibleYears).toString();

  return `${startYear}-${endYear}`;
}

class YearRangePickerModal extends PureComponent {
  static propTypes = {
    onRangeConfirmed: PropTypes.func,
    resetButtonTitle: PropTypes.string,
    confirmButtonTitle: PropTypes.string,
    selectedYears: PropTypes.arrayOf(PropTypes.number),
    rangeStart: PropTypes.number,
    rangeEnd: PropTypes.number,
    visible: PropTypes.bool,
    style: PropTypes.any,
    containerStyle: PropTypes.any,
  };

  static defaultProps = {
    selectedYears: [],
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.YEARS_PER_PAGE = NUMBER_OF_ROWS * YEARS_IN_ROW;

    this.state = {
      collapsed: false,
      visibleYears: resolveVisibleYears(props),
      selectedYears: props.selectedYears,
    };
  }

  handleConfirmPress() {
    const { selectedYears } = this.state;
    const { onRangeConfirmed } = this.props;

    if (onRangeConfirmed) {
      LayoutAnimation.easeInEaseOut();
      onRangeConfirmed(selectedYears);
    }
  }

  handleResetPress() {
    const { onRangeConfirmed } = this.props;

    LayoutAnimation.easeInEaseOut();
    this.setState({ selectedYears: [] });

    if (onRangeConfirmed) {
      onRangeConfirmed([]);
    }
  }

  handleYearsForwardPress() {
    const { rangeEnd } = this.props;
    const { visibleYears } = this.state;

    const nextYearStart = _.last(visibleYears) + 1;
    const nextYearEnd = Math.min(rangeEnd, nextYearStart + this.YEARS_PER_PAGE - 1);

    const nextVisibleYears = _.times(nextYearEnd + 1 - nextYearStart, index => nextYearStart + index);

    LayoutAnimation.easeInEaseOut();
    this.setState({ visibleYears: nextVisibleYears });
  }

  handleYearsBackPress() {
    const { visibleYears } = this.state;

    const prevYearStart = _.head(visibleYears) - this.YEARS_PER_PAGE;

    LayoutAnimation.easeInEaseOut();
    this.setState({ visibleYears: _.times(this.YEARS_PER_PAGE, index => prevYearStart + index) });
  }

  handleYearPress(year) {
    const { selectedYears } = this.state;

    const size = _.size(selectedYears);
    const index = _.indexOf(selectedYears, year);

    LayoutAnimation.easeInEaseOut();

    return () => {
      if (_.includes(selectedYears, year)) {
        if (_.last(selectedYears) === year || _.head(selectedYears) === year) {
          this.setState({ selectedYears: _.without(selectedYears, year) });
          return;
        }

        const cutFromEnd = size / 2 <= index;
        const newYears = _.filter(selectedYears, value => cutFromEnd ? value <= year : value >= year);

        this.setState({ selectedYears: newYears });
        return;
      }

      if (_.isEmpty(selectedYears)) {
        this.setState({ selectedYears: [year] });
        return;
      }

      const addToEnd = _.last(selectedYears) < year;
      const yearsToAdd = addToEnd ? year - _.last(selectedYears) : _.head(selectedYears) - year;

      const newYears = addToEnd
        ? [...selectedYears, ..._.times(yearsToAdd, index => _.last(selectedYears) + index + 1)]
        : [...selectedYears, ..._.times(yearsToAdd, index => _.head(selectedYears) - index + -1)]
      const sortedYears = _.sortBy(newYears, item => item);

      this.setState({ selectedYears: sortedYears });
    }
  }

  renderYear(year) {
    const { style } = this.props;
    const { selectedYears } = this.state;

    const isSelected = _.includes(selectedYears, year);
    const isFirst = _.head(selectedYears) === year;
    const isLast = _.last(selectedYears) === year;

    return (
      <TouchableOpacity
        onPress={this.handleYearPress(year)}
        style={style.yearContainer}
        key={year.toString()}
      >
        <View style={[
          style.year,
          isSelected && style.yearSelected,
          isFirst && style.yearFirst,
          isLast && style.yearLast,
        ]}>
          <Text>{year.toString()}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderYearRow(row, index) {
    return (
      <View styleName="horizontal" key={index.toString()}>
        {_.map(row, this.renderYear)}
      </View>
    )
  }

  render() {
    const { style, visible, containerStyle, confirmButtonTitle, resetButtonTitle } = this.props;
    const { visibleYears } = this.state;

    const buttonTooltip = resolveRangeTooltip(visibleYears);
    const data = _.chunk(visibleYears, YEARS_IN_ROW);

    if (!visible) {
      return null;
    }

    return (
      <View style={[style.container, containerStyle]}>
        <View style={style.tooltipContainer}>
          <Button styleName="clear tight" onPress={this.handleYearsBackPress}>
            <Icon name="left-arrow" style={style.icon} />
          </Button>
          <Text>{buttonTooltip}</Text>
          <Button styleName="clear tight" onPress={this.handleYearsForwardPress}>
            <Icon name="right-arrow" style={style.icon} />
          </Button>
        </View>
        {_.times(NUMBER_OF_ROWS, (row) => this.renderYearRow(data[row], row))}
        <View style={style.buttonContainer}>
          <Button styleName="secondary flexible" onPress={this.handleResetPress}>
            <Text>{resetButtonTitle}</Text>
          </Button>
          <Button styleName="primary flexible md-gutter-left" onPress={this.handleConfirmPress}>
            <Text>{confirmButtonTitle}</Text>
          </Button>
        </View>
      </ View>
    );
  }
}

export default connectStyle('shoutem.ui.YearRangePickerModal')(YearRangePickerModal);
