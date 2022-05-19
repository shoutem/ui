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

  renderPageIndicator(index, count, activeIndex, indicatorStyle) {
    const { style } = this.props;
    return (
      <View style={style.indicatorContainer} key={`pageIndicator${index}`}>
        <View styleName={indicatorStyle} />
      </View>
    );
  }

  render() {
    const { style, count, maxCount, activeIndex } = this.props;

    const pageIndicators = [];
    const maxIndicatorsCount = Math.min(count, maxCount);

    for (let i = 0; i < maxIndicatorsCount; i += 1) {
      let indicatorStyle = '';

      if (activeIndex === i) {
        // If currently selected index matches index of page indicator that is rendered
        // then we should apply different styling
        indicatorStyle = 'selected';
      } else if (activeIndex >= i && maxIndicatorsCount - 1 === i) {
        // If currently selected index exceeds over number of indicators,
        // we should treat last indicator as selected one
        indicatorStyle = 'selected';
      }

      pageIndicators.push(
        this.renderPageIndicator(
          i,
          maxIndicatorsCount,
          activeIndex,
          indicatorStyle,
        ),
      );
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
