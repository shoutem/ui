import React, {
  Component,
  PropTypes,
} from 'react';

import { connectStyle } from '@shoutem/theme';
import { View } from './View';

/**
 * Renders Page indicators (dots)
 */

class PageIndicators extends Component {
  static propTypes = {
    // ActiveIndex: number defining which page indicator will be rendered as active (selected)
    activeIndex: PropTypes.number,
    // Count: number defining how many page indicators will be rendered
    count: PropTypes.number,
    // maxIndicatorCount defining highest number of page indicators that can be rendered
    // If `count` is higher than `maxIndicatorCount`, then `maxIndicatorCount` number of indicators
    // will be rendered. Defaults to 10
    maxIndicatorCount: PropTypes.number,
    // Style prop used to override default (theme) styling
    style: PropTypes.object,
  };

  static defaultProps = {
    maxIndicatorCount: 10,
  }

  constructor(props) {
    super(props);
    this.renderPageIndicator = this.renderPageIndicator.bind(this);
  }

  renderPageIndicator(page, maxIndicatorsCount) {
    const { style, activeIndex } = this.props;

    let resolvedStyle = style.pageIndicator;

    if (activeIndex === page) {
      // If currently selected index matches index of page indicator that is rendered
      // then we should apply different styling
      resolvedStyle = { ...style.pageIndicator, ...style.selectedPageIndicator };
    } else if (activeIndex >= maxIndicatorsCount && page === (maxIndicatorsCount - 1)) {
      // If currently selected index exceeds over number of indicators,
      // we should treat last indicator as selected one
      resolvedStyle = { ...style.pageIndicator, ...style.selectedPageIndicator };
    }

    return (
      <View
        style={style.pageIndicatorContainer}
        key={`pageIndicator${page}`}
      >
        <View style={resolvedStyle} />
      </View>
    );
  }

  render() {
    const { style, count, maxIndicatorCount } = this.props;

    const pageIndicators = [];
    const maxIndicatorsCount = Math.min(count, maxIndicatorCount);

    // We're allowing up to 10 page indicators
    for (let i = 0; i < maxIndicatorsCount; i += 1) {
      pageIndicators.push(this.renderPageIndicator(i, maxIndicatorsCount));
    }

    return (
      <View style={style.pageIndicatorsContainer}>
        {pageIndicators}
      </View>
    );
  }

}

const StyledPageIndicators = connectStyle('shoutem.ui.PageIndicators', {})(PageIndicators);

export {
  StyledPageIndicators as PageIndicators,
};
