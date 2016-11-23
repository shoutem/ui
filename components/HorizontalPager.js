import React, {
  Component,
  PropTypes,
} from 'react';

import {
  ScrollView,
  InteractionManager,
} from 'react-native';

import _ from 'lodash';

import { connectStyle } from '@shoutem/theme';

import { View } from './View';
import { Spinner } from './Spinner';

const MAX_INDICATOR_COUNT = 10;

/**
 * Renders a horizontal pager which renders pages by using
 * the renderPage function with provided data.
 *
 * It can be used as a general wrapper component for any group
 * of uniform components which require horizontal paging.
 * It abstracts away React Native API inconsistencies between
 * iOS and Android platforms and should be used instead of
 * ScrollView and ViewPagerAndroid for this matter.
 *
 */

class HorizontalPager extends Component {
  static propTypes = {
    // Prop defining whether the Pager will bounce back
    // when user tries to swipe beyond end of content (iOS only)
    bounces: PropTypes.bool,
    // Array containing objects (pages)
    data: PropTypes.arrayOf(
      PropTypes.object,
    ).isRequired,
    // Callback function called when user swipes between pages (images)
    // Index of new (selected) page is passed to this callback
    onIndexSelected: PropTypes.func,
    // Page margin, margin visible between pages, during swipe gesture.
    pageMargin: PropTypes.number,
    // Callback function which renders single page
    renderPage: PropTypes.func,
    // Callback function that can be used to override rendering of default page indicators
    // Or boolean value to use default page indicators (true), or to disable rendering (false)
    renderPageIndicators: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.bool,
    ]),
    // Callback function that can be used to override rendering of default Placeholder
    // That appears when content is loading
    renderPlaceholder: PropTypes.func,
    // Initially selected page in gallery
    selectedIndex: PropTypes.number,
    // Prop that forces enables or disables swiping
    scrollEnabled: PropTypes.bool,
    // Style prop used to override default (theme) styling
    style: PropTypes.object,
    // Prop that reduces page size by pageMargin, allowing 'sneak peak' of next page
    showNextPage: PropTypes.bool,
  };

  static defaultProps = {
    pageMargin: 0,
    selectedIndex: 0,
    showNextPage: false,
    renderPlaceholder: () => {
      return (
        <View styleName="flexible vertical v-center">
          <View styleName="horizontal h-center">
            <Spinner />
          </View>
        </View>
      );
    },
  }

  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      selectedIndex: this.props.selectedIndex,
      initialSelectedIndex: this.props.selectedIndex,
      pageMargin: this.props.pageMargin,
      showNextPage: this.props.showNextPage,
      shouldRenderContent: false,
    };
    this.calculateIndex = this.calculateIndex.bind(this);
    this.onHorizontalScroll = this.onHorizontalScroll.bind(this);
    this.onLayoutContainer = this.onLayoutContainer.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.scrollToPage = this.scrollToPage.bind(this);
    this.calculateContainerWidth = this.calculateContainerWidth.bind(this);
    this.renderPageIndicator = this.renderPageIndicator.bind(this);
    this.renderPageIndicators = this.renderPageIndicators.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ shouldRenderContent: true });
    });
  }

  componentWillReceiveProps(nextProps) {
    const { selectedIndex } = this.state;

    if (this.props.scrollEnabled && !nextProps.scrollEnabled) {
      this.scrollToPage(selectedIndex);
    }
  }

  onLayoutContainer(event) {
    const { width } = event.nativeEvent.layout;
    const { initialSelectedIndex } = this.state;

    this.setState({ width }, () =>
      this.scrollToPage(initialSelectedIndex)
    );
  }

  onHorizontalScroll(event) {
    const { selectedIndex } = this.state;
    const { onIndexSelected } = this.props;
    const contentOffset = event.nativeEvent.contentOffset;

    const newSelectedIndex = this.calculateIndex(contentOffset);

    if (selectedIndex !== newSelectedIndex) {
      if (_.isFunction(onIndexSelected)) {
        onIndexSelected(newSelectedIndex);
      }
      this.setState({
        selectedIndex: newSelectedIndex,
      });
    }
  }

  calculateContainerWidth() {
    const { style } = this.props;
    const { width, pageMargin, showNextPage } = this.state;
    // If `showNextPage` is `true` then container must have width narrower
    // By `nextPageInsetSize`, to allow rendering of small portion of next page
    // While keeping `pageMargin` intact between pages
    // If `showNextPage` is `false`, then `nextPageInsetSize` doesn't matter,
    // And we only use `pageMargin` for spacing between pages.
    return showNextPage ? (width - style.nextPageInsetSize) : (width + pageMargin);
  }

  scrollToPage(page) {
    const { width } = this.state;

    if (this.scroller && width && page) {
      this.scroller.scrollTo({
        x: page * this.calculateContainerWidth(),
        animated: false,
      });
    }
  }

  calculateIndex(contentOffset) {
    const { width, selectedIndex, pageMargin } = this.state;
    const { data } = this.props;

    let newSelectedIndex = selectedIndex;

    if (contentOffset.x <= 0) {
      newSelectedIndex = 0;
    }

    if (selectedIndex >= data.length - 1) {
      newSelectedIndex = data.length - 1;
    }

    if (width && contentOffset.x > 0) {
      newSelectedIndex = Math.round(contentOffset.x / (width + pageMargin));
    }
    return newSelectedIndex;
  }

  renderContent() {
    const { width, pageMargin, showNextPage } = this.state;
    const { data, renderPage, style } = this.props;
    const pages = data.map((page, pageId) => {
      const lastPage = pageId === data.length - 1;
      const containerWidth = this.calculateContainerWidth();
      let pageWidth = width;

      if (showNextPage && !lastPage) {
        // If `showNextPage` is `true` then one page must have width narrower
        // By pageMargin - nextPageInsetSize, to allow rendering of small portion of next page
        // While keeping pageMargin intact between pages
        pageWidth = width - pageMargin - style.nextPageInsetSize;
      }

      return (
        <View
          style={{ ...style.page, width: containerWidth }}
          key={pageId}
          renderToHardwareTextureAndroid
        >
          <View style={{ ...style.page, width: pageWidth }}>
            {renderPage(page, pageId)}
          </View>
        </View>
      );
    });
    return pages;
  }

  renderPageIndicator(page, maxIndicatorsCount) {
    const { style, data } = this.props;
    const { selectedIndex } = this.state;

    let resolvedStyle = style.pageIndicator;

    if (selectedIndex === page) {
      // If currently selected index matches index of page indicator that is rendered
      // then we should apply different styling
      resolvedStyle = { ...style.pageIndicator, ...style.selectedPageIndicator };
    } else if (selectedIndex >= maxIndicatorsCount && page === (maxIndicatorsCount - 1)) {
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

  renderPageIndicators() {
    const { renderPageIndicators, data, style } = this.props;
    if (renderPageIndicators === false) {
      // Do not render page indicators if user explicitly passes 'false'
      return null;
    } else if (_.isFunction(renderPageIndicators)) {
      // If renderPageIndicator is callback, then user has overriden default render method
      return renderPageIndicators();
    }
    // If neither, fallback to default page indicators.
    const pageIndicators = [];
    const maxIndicatorsCount = Math.min(data.length, MAX_INDICATOR_COUNT);

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

  render() {
    const { bounces, scrollEnabled, style, renderPlaceholder } = this.props;
    const { shouldRenderContent } = this.state;

    if (!shouldRenderContent) {
      if (_.isFunction(renderPlaceholder)) {
        return renderPlaceholder();
      }
    }

    return (
      <View
        style={style.container}
        onLayout={this.onLayoutContainer}
      >
        <ScrollView
          ref={(scroller) => { this.scroller = scroller; }}
          style={[style.scrollView, { width: this.calculateContainerWidth() }]}
          horizontal
          pagingEnabled
          bounces={bounces}
          scrollsToTop={false}
          onScroll={this.onHorizontalScroll}
          scrollEventThrottle={200}
          removeClippedSubviews={false}
          automaticallyAdjustContentInsets={false}
          scrollEnabled={scrollEnabled}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {this.renderContent()}
        </ScrollView>
        {this.renderPageIndicators()}
      </View>
    );
  }

}

const StyledHorizontalPager = connectStyle('shoutem.ui.HorizontalPager', {})(HorizontalPager);

export {
  StyledHorizontalPager as HorizontalPager,
};
