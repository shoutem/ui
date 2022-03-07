import React, { PureComponent } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  SectionList,
  StatusBar,
  View,
} from 'react-native';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Divider } from './Divider';
import { EmptyListImage } from './EmptyListImage';
import { Spinner } from './Spinner';
import { Caption } from './Text';

const Status = {
  LOADING: 'loading',
  LOADING_NEXT: 'loadingNext',
  REFRESHING: 'refreshing',
  IDLE: 'idle',
};

function renderDefaultSectionHeader(section) {
  const title = _.get(section, 'title', '');

  return (
    <Divider styleName="section-header">
      <Caption>{title.toUpperCase()}</Caption>
    </Divider>
  );
}

class ListView extends PureComponent {
  static getDerivedStateFromProps(props, state) {
    const isLoading = props.loading;

    if (isLoading) {
      if (state.status !== Status.IDLE) {
        // We are already in a loading status
        return state;
      }

      return { status: Status.LOADING };
    }
    return { status: Status.IDLE };
  }

  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    this.listView = null;

    this.state = {
      status: props.loading ? Status.LOADING : Status.IDLE,
    };
  }

  componentWillUnmount() {
    const { status } = this.state;

    if (Platform.OS === 'ios' && status !== Status.IDLE) {
      // Reset the global network indicator state
      StatusBar.setNetworkActivityIndicatorVisible(false);
    }
  }

  onRefresh() {
    const { onRefresh } = this.props;

    this.setState({
      status: Status.REFRESHING,
    });

    if (onRefresh) {
      onRefresh();
    }
  }

  /**
   * Used to map props we are passing to React Native ListView.
   * Setting default values.
   * @returns {{}}
   */
  getPropsToPass() {
    const {
      style,
      renderHeader,
      autoHideHeader,
      renderRow,
      hasFeaturedItem,
      sections,
      data,
      renderFeaturedItem,
      renderSectionHeader,
      onRefresh,
      onLoadMoreThreshold,
      keyExtractor,
      contentContainerStyle,
      ListEmptyComponent,
    } = this.props;
    const { refreshing } = this.state;
    const mappedProps = {
      ...this.props,
    };

    // configuration
    // default load more threshold
    mappedProps.onEndReachedThreshold = onLoadMoreThreshold;

    // style
    mappedProps.style = style.list;
    mappedProps.contentContainerStyle = {
      ...contentContainerStyle,
      ...style.listContent,
    };

    if (Platform.OS === 'ios' && parseInt(Platform.Version, 10) === 13) {
      mappedProps.scrollIndicatorInsets = { right: 1 };
    }

    // rendering
    mappedProps.ListHeaderComponent = this.createListHeaderComponent(
      renderHeader,
      autoHideHeader,
    );
    mappedProps.renderItem = data => renderRow(data.item, data.index);
    mappedProps.ListFooterComponent = this.renderFooter;

    if (hasFeaturedItem && !sections) {
      mappedProps.sections = [
        { data: [data[0]], renderItem: data => renderFeaturedItem(data.item) },
        { data: data.slice(1) },
      ];
    }

    if (renderSectionHeader) {
      mappedProps.renderSectionHeader = ({ section }) =>
        renderSectionHeader(section);
    } else if (!hasFeaturedItem) {
      mappedProps.renderSectionHeader = ({ section }) =>
        renderDefaultSectionHeader(section);
    }

    // events
    mappedProps.onEndReached = this.createOnLoadMore();

    // data to display
    mappedProps.data = data;

    // key extractor
    if (!keyExtractor) {
      mappedProps.keyExtractor = (item, index) => index.toString();
    }

    // sections for SectionList
    if (sections) {
      mappedProps.sections = sections;
    }

    // is data refreshing
    mappedProps.refreshing = refreshing === Status.REFRESHING;

    // if list is empty and user haven't explicitly set ListEmptyComponent to null,
    // use default ListEmptyComponent
    if (ListEmptyComponent === undefined) {
      mappedProps.ListEmptyComponent = this.renderListEmptyComponent();
    }

    // if list is empty and user explicitly set ListEmptyComponent prop to null,
    // render nothing
    if (ListEmptyComponent === null) {
      mappedProps.ListEmptyComponent = null;
    }

    // refresh control
    mappedProps.refreshControl = onRefresh && this.renderRefreshControl();

    // reference
    mappedProps.ref = this.handleListViewRef;

    return mappedProps;
  }

  // eslint-disable-next-line consistent-return
  createOnLoadMore() {
    const { onLoadMore, data } = this.props;
    const { status } = this.state;
    if (onLoadMore) {
      return _.throttle(
        () => {
          if (!_.isEmpty(data) && status === Status.IDLE) {
            onLoadMore();
          }
        },
        2000,
        { leading: true },
      );
    }
  }

  autoHideHeader({
    nativeEvent: {
      layout: { height },
    },
  }) {
    this.scrollListView({ offset: height, animated: false });
  }

  createListHeaderComponent(renderHeader, autoHideHeader) {
    if (!renderHeader) {
      return;
    }

    const { style } = this.props;
    const headerContainerProps = {
      style: style.headerContainer,
    };

    if (autoHideHeader) {
      headerContainerProps.onLayout = this.autoHideHeader;
    }

    // eslint-disable-next-line consistent-return
    return <View {...headerContainerProps}>{renderHeader()}</View>;
  }

  scrollListView(scrollOptions) {
    this.listView.scrollToOffset(scrollOptions);
  }

  /**
   * Save RN ListView ref
   * @param listView React native ListView ref
   */
  handleListViewRef(listView) {
    if (!listView) {
      return;
    }

    this.listView = listView;
  }

  renderFooter() {
    const { style, renderFooter } = this.props;
    const { status } = this.state;
    let spinner;

    let showNetworkActivity = true;
    switch (status) {
      case Status.LOADING:
        spinner = (
          <View style={style.loadMoreSpinner}>
            <Spinner />
          </View>
        );
        break;
      case Status.LOADING_NEXT:
        spinner = (
          <View style={style.loadMoreSpinner}>
            <Spinner />
          </View>
        );
        break;
      case Status.REFRESHING:
        spinner = null;
        break;
      default:
        showNetworkActivity = false;
        spinner = null;
    }

    if (Platform.OS === 'ios') {
      StatusBar.setNetworkActivityIndicatorVisible(showNetworkActivity);
    }

    return (
      <View>
        {spinner}
        {renderFooter ? renderFooter() : null}
      </View>
    );
  }

  renderListEmptyComponent() {
    const { loading } = this.props;

    if (loading) {
      return null;
    }

    const { ListEmptyComponent } = this.props;

    if (ListEmptyComponent) {
      return <ListEmptyComponent />;
    }

    const { emptyListMessage, emptyListTitle } = this.props;

    return <EmptyListImage message={emptyListMessage} title={emptyListTitle} />;
  }

  renderRefreshControl() {
    const { style } = this.props;
    const { status } = this.state;
    const refreshControlStyle = {
      ...style.refreshControl,
    };
    delete refreshControlStyle.tintColor;

    return (
      <RefreshControl
        onRefresh={this.onRefresh}
        refreshing={status === Status.REFRESHING}
        tintColor={style.refreshControl.tintColor}
        style={refreshControlStyle}
      />
    );
  }

  render() {
    const {
      emptyListMessage,
      emptyListTitle,
      sections,
      hasFeaturedItem,
      ListEmptyComponent,
      loading,
    } = this.props;

    // ListEmptyComponent in SectionList is handled differently due to the known
    // issue with empty data interpretation.
    // https://github.com/facebook/react-native/issues/14721
    if (
      sections &&
      _.every(sections, section => _.isEmpty(section.data)) &&
      !loading
    ) {
      return ListEmptyComponent ? (
        <ListEmptyComponent />
      ) : (
        <EmptyListImage message={emptyListMessage} title={emptyListTitle} />
      );
    }

    if (sections || hasFeaturedItem) {
      return <SectionList {...this.getPropsToPass()} />;
    }

    return <FlatList {...this.getPropsToPass()} />;
  }
}

ListView.propTypes = {
  autoHideHeader: PropTypes.bool,
  contentContainerStyle: PropTypes.object,
  data: PropTypes.array,
  emptyListMessage: PropTypes.string,
  emptyListTitle: PropTypes.string,
  getSectionId: PropTypes.func,
  hasFeaturedItem: PropTypes.bool,
  keyExtractor: PropTypes.func,
  ListEmptyComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  loading: PropTypes.bool,
  renderFeaturedItem: PropTypes.func,
  renderFooter: PropTypes.func,
  renderHeader: PropTypes.func,
  renderRow: PropTypes.func,
  renderSectionHeader: PropTypes.func,
  scrollDriver: PropTypes.object,
  sections: PropTypes.array,
  style: PropTypes.object,
  onLoadMore: PropTypes.func,
  onLoadMoreThreshold: PropTypes.number,
  onRefresh: PropTypes.func,
};

ListView.defaultProps = {
  autoHideHeader: false,
  contentContainerStyle: {},
  data: undefined,
  emptyListMessage: undefined,
  emptyListTitle: undefined,
  getSectionId: undefined,
  hasFeaturedItem: false,
  keyExtractor: undefined,
  ListEmptyComponent: undefined,
  loading: false,
  renderFeaturedItem: undefined,
  renderFooter: undefined,
  renderHeader: undefined,
  renderRow: undefined,
  renderSectionHeader: undefined,
  scrollDriver: undefined,
  sections: undefined,
  style: {},
  onLoadMore: undefined,
  onLoadMoreThreshold: 0.5,
  onRefresh: undefined,
};

const StyledListView = connectStyle('shoutem.ui.ListView', {
  listContent: {
    paddingBottom: 5,
  },
  refreshControl: {
    tintColor: '#ccc',
  },
  loadMoreSpinner: {
    paddingVertical: 25,
  },
})(ListView);

function getRNListViewComponent(context) {
  return _.get(context, 'wrappedInstance.listView');
}

StyledListView.prototype.scrollTo = function scrollTo(coordinates) {
  const listView = getRNListViewComponent(this);
  if (listView) {
    listView.scrollTo(coordinates);
  }
};

StyledListView.prototype.scrollToEnd = function scrollToEnd(animation) {
  const listView = getRNListViewComponent(this);
  if (listView) {
    listView.scrollToEnd(animation);
  }
};

export { StyledListView as ListView };
