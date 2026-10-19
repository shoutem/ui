import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from './View';

/**
 * Renders Page indicators (dots)
 */
class PageIndicators extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  /**
   * Renders a single dot. The dot reads its look from the explicit
   * `indicator` / `selectedIndicator` style keys; the legacy `selected`
   * styleName is still applied so themes that target the dot through an
   * `indicatorContainer['shoutem.ui.View']` selector keep working.
   *
   * @param {number} index The dot's index.
   * @param {boolean} isSelected Whether the dot represents the active page.
   * @returns {JSX.Element}
   */
  renderPageIndicator(index, isSelected) {
    const { style } = this.props;
    const indicatorStyle = isSelected
      ? { ...style.indicator, ...style.selectedIndicator }
      : style.indicator;

    return (
      <View style={style.indicatorContainer} key={`pageIndicator${index}`}>
        <View styleName={isSelected ? 'selected' : ''} style={indicatorStyle} />
      </View>
    );
  }

  render() {
    const { style, count, maxCount, activeIndex } = this.props;

    const pageIndicators = [];
    const maxIndicatorsCount = Math.min(count, maxCount);

    for (let i = 0; i < maxIndicatorsCount; i += 1) {
      // The dot matching the active index is selected; when the active index
      // exceeds the number of rendered dots, the last dot stands in for it.
      const isSelected =
        activeIndex === i || (activeIndex >= i && maxIndicatorsCount - 1 === i);

      pageIndicators.push(this.renderPageIndicator(i, isSelected));
    }

    return <View style={style.container}>{pageIndicators}</View>;
  }
}

PageIndicators.propTypes = {
  // Style prop used to override default (theme) styling
  style: PropTypes.object.isRequired,
  // ActiveIndex: number defining which page indicator will be rendered as active (selected)
  activeIndex: PropTypes.number,
  // Count: number defining how many page indicators will be rendered
  count: PropTypes.number,
  // maxCount defining highest number of page indicators that can be rendered
  // If `count` is higher than `maxCount`, then `maxCount` number of indicators
  // will be rendered. Defaults to 10
  maxCount: PropTypes.number,
};

PageIndicators.defaultProps = {
  activeIndex: undefined,
  count: undefined,
  maxCount: 10,
};

const StyledPageIndicators = connectStyle('shoutem.ui.PageIndicators')(
  PageIndicators,
);

export { StyledPageIndicators as PageIndicators };
