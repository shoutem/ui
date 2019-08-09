import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  FlatList,
  SectionList,
  RefreshControl,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import _ from 'lodash';

import { connectStyle } from '@shoutem/theme';

import { Caption } from './Text';
import { Divider } from './Divider';
import { Spinner } from './Spinner';

const scrollViewProps = _.keys(ScrollView.propTypes);

const Status = {
  LOADING: 'loading',
  LOADING_NEXT: 'loadingNext',
  REFRESHING: 'refreshing',
  IDLE: 'idle',
};

class ListView extends Component {
  static propTypes = {
    autoHideHeader: PropTypes.bool,
    style: PropTypes.object,
    data: PropTypes.array,
    loading: PropTypes.bool,
    onLoadMore: PropTypes.func,
    onRefresh: PropTypes.func,
    getSectionId: PropTypes.func,
    sections: PropTypes.object,
    renderRow: PropTypes.func,
    renderHeader: PropTypes.func,
    renderFooter: PropTypes.func,
    renderSectionHeader: PropTypes.func,
    scrollDriver: PropTypes.object,
    hasFeaturedItem: PropTypes.bool,
    renderFeaturedItem: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.handleListViewRef = this.handleListViewRef.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.autoHideHeader = this.autoHideHeader.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.renderRefreshControl = this.renderRefreshControl.bind(this);
    this.listView = null;

    this.state = {
      status: props.loading ? Status.LOADING : Status.IDLE,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loading !== this.props.loading) {
      this.setLoading(nextProps.loading);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.data !== this.props.data) ||
      (nextProps.loading !== this.props.loading) ||
      (nextState.status !== this.state.status);
  }

  componentWillUnmount() {
    if ((Platform.OS === 'ios') && (this.state.status !== Status.IDLE)) {
      // Reset the global network indicator state
      StatusBar.setNetworkActivityIndicatorVisible(false);
    }
  }

  onRefresh() {
    this.setState({
      status: Status.REFRESHING,
    });

    if (this.props.onRefresh) {
      this.props.onRefresh();
    }
  }

  /**
   * Used to map props we are passing to React Native ListView.
   * Setting default values.
   * @returns {{}}
   */
  getPropsToPass() {
    const props = this.props;
    const mappedProps = {
      ...props,
    };

    // configuration
    // default load more threshold
    mappedProps.onEndReachedThreshold = 40;

    // style
    mappedProps.style = props.style.list;
    mappedProps.contentContainerStyle = props.style.listContent;

    // rendering
    mappedProps.ListHeaderComponent = this.createRenderHeader(props.renderHeader, props.autoHideHeader);
    mappedProps.renderItem = (data) => props.renderRow(data.item);
    mappedProps.ListFooterComponent = this.renderFooter;

    if (props.hasFeaturedItem && !props.sections) {
      mappedProps.sections = [
        { data: [props.data[0]], renderItem: (data) => props.renderFeaturedItem(data.item) },
        { data: props.data.slice(1) },
      ]
    }

    if (props.renderSectionHeader) {
      mappedProps.renderSectionHeader = ({section}) => props.renderSectionHeader(section);
    }
    else if (!props.hasFeaturedItem) {
      mappedProps.renderSectionHeader = ({section}) => this.renderDefaultSectionHeader(section);
    }

    // events
    mappedProps.onEndReached = this.createOnLoadMore();

    // data to display
    mappedProps.data = props.data;

    // key extractor
    mappedProps.keyExtractor = (item, index) => index.toString();

    // sections for SectionList
    if (props.sections) {
      mappedProps.sections = props.sections;
    }

    // is data refreshing
    mappedProps.refreshing = this.state.refreshing === Status.REFRESHING;

    // refresh control
    mappedProps.refreshControl = props.onRefresh && this.renderRefreshControl();

    // reference
    mappedProps.ref = this.handleListViewRef;

    return mappedProps;
  }

  setLoading(loading) {
    if (loading) {
      if (this.state.status !== Status.IDLE) {
        // We are already in a loading status
        return;
      }

      this.setState({
        status: Status.LOADING,
      });
    } else {
      this.setState({
        status: Status.IDLE,
      });
    }
  }

  // eslint-disable-next-line consistent-return
  createOnLoadMore() {
    const { onLoadMore, data } = this.props;
    const { status } = this.state;
    if (onLoadMore) {
      return _.throttle(() => {
        if (!_.isEmpty(data) && status === Status.IDLE) {
          onLoadMore();
        }
      }, 2000, { leading: true });
    }
  }

  autoHideHeader({ nativeEvent: { layout: { height } } }) {
    this.scrollListView({ y: height, animated: false });
  }

  createRenderHeader(renderHeader, autoHideHeader) {
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
    return () => (
      <View {...headerContainerProps}>{renderHeader()}</View>
    );
  }

  scrollListView(scrollOptions) {
    this.listView.scrollTo(scrollOptions);
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

  renderDefaultSectionHeader(section) {
    const title = _.get(section, 'title', '');

    return (
      <Divider styleName="section-header">
        <Caption>{title.toUpperCase()}</Caption>
      </Divider>
    );
  }

  renderFooter() {
    const { style, renderFooter } = this.props;
    const { status } = this.state;
    let spinner;

    let showNetworkActivity = true;
    switch (status) {
      case Status.LOADING:
        spinner = <View style={style.loadMoreSpinner}><Spinner /></View>;
        break;
      case Status.LOADING_NEXT:
        spinner = <View style={style.loadMoreSpinner}><Spinner /></View>;
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
    const { sections, hasFeaturedItem } = this.props;

    if (sections || hasFeaturedItem) {
      return <SectionList {...this.getPropsToPass()} />;
    }

    return <FlatList {...this.getPropsToPass()} />;
  }
}

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

export {
  StyledListView as ListView,
};
