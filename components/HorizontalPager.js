import React, {
  Component,
  PropTypes,
} from 'react';

import {
  ScrollView,
  InteractionManager,
  LayoutAnimation,
} from 'react-native';

import _ from 'lodash';

import { connectStyle } from '@shoutem/theme';

import { View } from './View';

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
    // Callback function that can be used to render overlay over pages
    // For example page indicators using `PageIndicators` component
    // renderOverlay(selectedIndex, data)
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
      scrolledToInitialIndex: false,
    };
    this.calculateIndex = this.calculateIndex.bind(this);
    this.onHorizontalScroll = this.onHorizontalScroll.bind(this);
    this.onLayoutContainer = this.onLayoutContainer.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.scrollToPage = this.scrollToPage.bind(this);
    this.calculateContainerWidth = this.calculateContainerWidth.bind(this);
    this.renderOverlay = this.renderOverlay.bind(this);
    this.isPageIndexValid = this.isPageIndexValid.bind(this);
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
    const { width } = event.nativeEvent.layout;
    const { initialSelectedIndex, scrolledToInitialIndex } = this.state;

    this.setState({ width }, () => {
      // By checking has the pager scrolled to initial index, we're avoiding weird issue
      // where pager would scroll back to initial index after swiping to other index
      if (!scrolledToInitialIndex) {
        this.scrollToPage(initialSelectedIndex);
      }
    });
  }

  onHorizontalScroll(event) {
    const { selectedIndex, scrolledToInitialIndex, initialSelectedIndex } = this.state;
    const { onIndexSelected } = this.props;
    const contentOffset = event.nativeEvent.contentOffset;

    const newSelectedIndex = this.calculateIndex(contentOffset);

    // We're firing onIndexSelected(initialSelectedIndex) event if scrolling
    // to `initialSelectedIndex` has finished
    if (initialSelectedIndex === newSelectedIndex && !scrolledToInitialIndex) {
      if (_.isFunction(onIndexSelected)) {
        onIndexSelected(initialSelectedIndex);
      }
      this.setState({
        selectedIndex: initialSelectedIndex,
        scrolledToInitialIndex: true,
      });
    }

    // And anytime when new index is selected (by swipe gesture)
    // when initial scrolling has finished
    if (selectedIndex !== newSelectedIndex && scrolledToInitialIndex) {
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

  isPageIndexValid(pageId) {
    const { data, surroundingPagesToLoad } = this.props;
    const { selectedIndex } = this.state;
    // If `selectedIndex` is <= `surroundingPagesToLoad` then `minPageIndex` that should be
    // rendered is 0, otherwise `minPageIndex` that should be rendered is
    // `selectedIndex - surroundingPagesToLoad`
    const minPageIndex = selectedIndex <= surroundingPagesToLoad ?
                        0 : selectedIndex - surroundingPagesToLoad;
    // And similar, `maxPageIndex` that should be rendered is data.length
    // or `selectedIndex` + surroundingPagesToLoad
    const maxPageIndex = selectedIndex >= (data.length - surroundingPagesToLoad - 1) ?
                        data.length - 1 : selectedIndex + surroundingPagesToLoad;

    return pageId >= minPageIndex && pageId <= maxPageIndex;
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
          virtual
        >
          <View
            virtual
            style={{ ...style.page, width: pageWidth }}
          >
            {this.isPageIndexValid(pageId) && renderPage(page, pageId)}
          </View>
        </View>
      );
    });
    return pages;
  }

  renderOverlay() {
    const { renderOverlay, data } = this.props;
    const { selectedIndex } = this.state;

    if (_.isFunction(renderOverlay)) {
      return renderOverlay(selectedIndex, data);
    }
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
        <View
          styleName="fill-parent"
          pointerEvents="none"
        >
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
