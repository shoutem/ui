import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';

import {
  ScrollView,
  InteractionManager,
  LayoutAnimation,
} from 'react-native';

import _ from 'lodash';

import { connectStyle } from '@shoutem/theme';

import {
  View,
} from '../../index';

import { Page } from './Page';

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
    // A function which renders a single page
    // renderPage(pageData, pageIndex)
    renderPage: PropTypes.func,
    // Callback function that can be used to render overlay over pages
    // For example page indicators using `PageIndicators` component
    // renderOverlay(pageData, pageIndex, layout)
    renderOverlay: PropTypes.func,
    // Callback function that can be used to define placeholder
    // that appears when content is loading
    renderPlaceholder: PropTypes.func,
    // Initially selected page in gallery
    selectedIndex: PropTypes.number,
    // Prop that forces enables or disables swiping
    scrollEnabled: PropTypes.bool,
    // Style prop used to override default (theme) styling
    style: PropTypes.object,
    // Prop that reduces page size by pageMargin, allowing 'sneak peak' of next page
    showNextPage: PropTypes.bool,
    // Always render only central (currently loaded) page plus `surroundingPagesToLoad`
    // to the left and to the right. If currently rendered page is out of bounds,
    // empty `View` (with set dimensions for proper scrolling) will be rendered
    // Defaults to 2.
    surroundingPagesToLoad: PropTypes.number,
  };

  static defaultProps = {
    pageMargin: 0,
    selectedIndex: 0,
    showNextPage: false,
    surroundingPagesToLoad: 2,
  };

  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      selectedIndex: this.props.selectedIndex,
      initialSelectedIndex: this.props.selectedIndex,
      pageMargin: this.props.pageMargin,
      showNextPage: this.props.showNextPage,
      shouldRenderContent: false,
      scrolledToInitialIndex: false,
    };
    this.onHorizontalScroll = this.onHorizontalScroll.bind(this);
    this.onLayoutContainer = this.onLayoutContainer.bind(this);
    this.onScrollViewRef = this.onScrollViewRef.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      LayoutAnimation.easeInEaseOut();
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
    const { width, height } = event.nativeEvent.layout;
    const { scrolledToInitialIndex } = this.state;

    if ((this.state.width === width) && (this.state.height === height)) {
      return;
    }

    this.setState({ width, height }, () => {
      // By checking has the pager scrolled to initial index, we're avoiding weird issue
      // where pager would scroll back to initial index after swiping to other index
      if (!scrolledToInitialIndex) {
        requestAnimationFrame(() => this.scrollToInitialPage());
      }
    });
  }

  onHorizontalScroll(event) {
    const { selectedIndex } = this.state;
    const { onIndexSelected } = this.props;
    const contentOffset = event.nativeEvent.contentOffset;

    const newSelectedIndex = this.calculateIndex(contentOffset);
    if (selectedIndex === newSelectedIndex) {
      // Nothing to do, we are already at the new index
      return;
    }

    // Handle the swipes between pages performed by the user
    if (selectedIndex !== newSelectedIndex) {
      this.setState({
        selectedIndex: newSelectedIndex,
      }, () => {
        if (_.isFunction(onIndexSelected)) {
          onIndexSelected(newSelectedIndex);
        }
      });
    }
  }

  onScrollViewRef(scroller) {
    this.scroller = scroller;
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

  scrollToInitialPage() {
    const { onIndexSelected } = this.props;
    const { initialSelectedIndex } = this.state;

    this.scrollToPage(initialSelectedIndex);
    this.setState({
      selectedIndex: initialSelectedIndex,
      scrolledToInitialIndex: true,
    }, () => {
      if (_.isFunction(onIndexSelected)) {
        onIndexSelected(initialSelectedIndex);
      }
    });
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

  shouldRenderPage(index) {
    const { data, surroundingPagesToLoad } = this.props;
    const { selectedIndex } = this.state;

    // We are rendering max surroundingPagesToLoad around the current index
    const minPageIndex = (selectedIndex <= surroundingPagesToLoad) ?
      0 : selectedIndex - surroundingPagesToLoad;

    const maxPageIndex = (selectedIndex >= (data.length - surroundingPagesToLoad - 1)) ?
      data.length - 1 : selectedIndex + surroundingPagesToLoad;

    return (index >= minPageIndex) && (index <= maxPageIndex);
  }

  renderPages() {
    const { width, height, pageMargin, showNextPage, selectedIndex } = this.state;
    const { data, renderPage, style } = this.props;

    const pages = data.map((pageData, pageIndex) => {
      const lastPage = pageIndex === data.length - 1;
      const containerWidth = this.calculateContainerWidth();
      let pageWidth = width;

      if (showNextPage && !lastPage) {
        // If `showNextPage` is `true` then one page must have width narrower
        // By pageMargin - nextPageInsetSize, to allow rendering of small portion of next page
        // While keeping pageMargin intact between pages
        pageWidth = width - pageMargin - style.nextPageInsetSize;
      }

      // Fixes where multiple pages appear at once on initial load (if surroundingPagesToLoad > 0)
      if (!containerWidth) return null;

      const isPageActive = (selectedIndex === pageIndex);
      const pageContent = this.shouldRenderPage(pageIndex) && (
        <Page
          isActive={isPageActive}
          width={pageWidth}
          style={style.page}
        >
          {renderPage(pageData, pageIndex, { width, height })}
        </Page>
      );

      return (
        <View key={pageIndex} style={{ width: containerWidth }}>
          {pageContent}
        </View>
      );
    });
    return pages;
  }

  renderOverlay() {
    const { renderOverlay, data } = this.props;
    const { selectedIndex } = this.state;

    if (_.isFunction(renderOverlay)) {
      return renderOverlay(data, selectedIndex);
    }

    return null;
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
        virtual
      >
        <ScrollView
          ref={this.onScrollViewRef}
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
          {this.renderPages()}
        </ScrollView>
        <View styleName="fill-parent" pointerEvents="box-none">
          {this.renderOverlay()}
        </View>
      </View>
    );
  }
}

const StyledHorizontalPager = connectStyle('shoutem.ui.HorizontalPager')(HorizontalPager);

export {
  StyledHorizontalPager as HorizontalPager,
};
