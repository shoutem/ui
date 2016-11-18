import React, {
  Component,
  PropTypes,
} from 'react';

import {
  ScrollView,
  InteractionManager,
  View as RNView,
} from 'react-native';

import _ from 'lodash';

import { connectStyle } from '@shoutem/theme';

import { View } from './View';
import { Spinner } from './Spinner';

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
    // Callback function
    renderPage: PropTypes.func,
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

  getSelectedIndex() {
    const { selectedIndex } = this.state;

    return selectedIndex;
  }

  calculateContainerWidth() {
    const { width, pageMargin, showNextPage } = this.state;
    return showNextPage ? (width - pageMargin) : (width + pageMargin);
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
      let containerWidth = this.calculateContainerWidth();

      // If `showNextPage` is `true` then one page must have width narrower
      // By nextPageInsetRatio*pageMargin.
      // To allow rendering of small portion of next page
      let pageWidth = showNextPage ? (width - (style.nextPageInsetRatio * pageMargin)) : width;

      if (lastPage && showNextPage) {
        // If page is last in collection, then it should populate whole container,
        containerWidth = width;
        pageWidth = width;
      }

      return (
        <RNView
          style={[style.page, { width: containerWidth }]}
          key={pageId}
          renderToHardwareTextureAndroid
        >
          <RNView style={[style.page, { width: pageWidth }]}>
            {renderPage(page, pageId)}
          </RNView>
        </RNView>
      );
    });
    return pages;
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
      <RNView
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
      </RNView>
    );
  }

}

const StyledHorizontalPager = connectStyle('shoutem.ui.HorizontalPager', {})(HorizontalPager);

export {
  StyledHorizontalPager as HorizontalPager,
};
