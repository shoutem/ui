import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ListView as RNListView,
  RefreshControl,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import { connectStyle } from '@shoutem/theme';
import { Spinner } from './Spinner';
import _ from 'lodash';

const scrollViewProps = _.keys(ScrollView.propTypes);

const Status = {
  LOADING: 'loading',
  LOADING_NEXT: 'loadingNext',
  REFRESHING: 'refreshing',
  IDLE: 'idle',
};

/**
 * Provides dataSource to ListView.
 * Clones items and group them by section if needed.
 */
class ListDataSource {
  constructor(config, getSectionId) {
    this.getSectionId = getSectionId;
    this.withSections = !!config.sectionHeaderHasChanged;
    this.dataSource = new RNListView.DataSource(config);
  }

  /**
   * Transforms items list ([...items]) to [[...sectionItems], [...sectionItems]]
   * @param data
   * @returns {*}
   */
  groupItemsIntoSections(data) {
    let prevSectionId;
    return data.reduce((sections, item) => {
      const sectionId = this.getSectionId(item);
      if (prevSectionId !== sectionId) {
        prevSectionId = sectionId;
        sections.push([]);
      }
      const lastSectionIndex = sections.length - 1;
      sections[lastSectionIndex].push(item);
      return sections;
    }, []);
  }

  /**
   * Transforms items list [<item>, <item>]
   * @param data
   * @returns {*}
   */
  clone(data) {
    if (this.withSections) {
      return this.dataSource.cloneWithRowsAndSections(this.groupItemsIntoSections(data));
    }
    return this.dataSource.cloneWithRows(data);
  }
}

class ListView extends React.Component {
  static propTypes = {
    autoHideHeader: PropTypes.bool,
    style: PropTypes.object,
    data: PropTypes.array,
    loading: PropTypes.bool,
    onLoadMore: PropTypes.func,
    onRefresh: PropTypes.func,
    getSectionId: PropTypes.func,
    renderRow: PropTypes.func,
    renderHeader: PropTypes.func,
    renderFooter: PropTypes.func,
    renderSectionHeader: PropTypes.func,
    scrollDriver: PropTypes.object,
    // TODO(Braco) - add render separator
  };

  constructor(props, context) {
    super(props, context);
    this.handleListViewRef = this.handleListViewRef.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.autoHideHeader = this.autoHideHeader.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.renderRefreshControl = this.renderRefreshControl.bind(this);
    this.listView = null;


    this.listDataSource = new ListDataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: props.renderSectionHeader ? (s1, s2) => s1 !== s2 : undefined,
      getSectionHeaderData: (dataBlob, sectionId) => props.getSectionId(dataBlob[sectionId][0]),
    }, props.getSectionId);


    this.state = {
      status: props.loading ? Status.LOADING : Status.IDLE,
      dataSource: this.listDataSource.clone(props.data),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({ dataSource: this.listDataSource.clone(nextProps.data) });
    }

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
    // React native warning
    // NOTE: In react 0.23 it can't be set to false
    mappedProps.enableEmptySections = true;

    // style
    mappedProps.style = props.style.list;

    mappedProps.contentContainerStyle = props.style.listContent;

    // rendering
    mappedProps.renderHeader = this.createRenderHeader(props.renderHeader, props.autoHideHeader);
    mappedProps.renderRow = props.renderRow;
    mappedProps.renderFooter = this.renderFooter;
    mappedProps.renderSectionHeader = props.renderSectionHeader;

    // events
    mappedProps.onEndReached = this.createOnLoadMore();

    // data to display
    mappedProps.dataSource = this.state.dataSource;

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
    return <RNListView {...this.getPropsToPass()} />;
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
