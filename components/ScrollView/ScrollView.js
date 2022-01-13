import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';
import { ScrollDriver, DriverShape } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';
import { ScrollDriverProvider } from './ScrollDriverProvider.js';
import { Device } from '../../helpers';

const isTabBarOnScreen = true;
const IPHONE_X_HOME_INDICATOR_PADDING = isTabBarOnScreen ? 0 : 34;

class ScrollView extends PureComponent {
  static propTypes = {
    ...Animated.ScrollView.propTypes,
    primary: PropTypes.bool,
  };

  static contextTypes = {
    animationDriver: DriverShape,
    driverProvider: PropTypes.object,
  };

  static childContextTypes = {
    animationDriver: DriverShape,
  };

  static DriverProvider = ScrollDriverProvider;

  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    this.animationDriver =
      props.driver ||
      new ScrollDriver(
        { useNativeDriver: true, nativeScrollEventThrottle: 20 },
        props.onScroll,
      );
  }

  getChildContext() {
    return {
      animationDriver: this.animationDriver,
    };
  }

  componentDidMount() {
    const { driverProvider } = this.context;
    const { primary } = this.props;

    if (driverProvider) {
      driverProvider.setAnimationDriver(this.animationDriver, primary);
    }
  }

  componentDidUpdate(prevProps) {
    const { driver } = this.props;
    const { animationDriver, driverProvider } = this.context;

    if (driver && this.animationDriver !== driver) {
      this.animationDriver = driver;
    }
  }

  setWrappedInstance(component) {
    this.wrappedInstance = component;
  }

  addIphoneXPadding(style) {
    if (typeof style.paddingBottom !== 'number') {
      style.paddingBottom = 0;
    }

    style.paddingBottom = Device.select({
      iPhoneX: style.paddingBottom + IPHONE_X_HOME_INDICATOR_PADDING,
      default: style.paddingBottom,
    });

    return style;
  }

  render() {
    const { props, animationDriver } = this;
    const { style = {} } = props;
    const contentContainerStyle = {
      ...style.contentContainerStyle,
    };
    delete style.contentContainerStyle;

    return (
      <Animated.ScrollView
        ref={this.setWrappedInstance}
        contentContainerStyle={this.addIphoneXPadding(contentContainerStyle)}
        {...animationDriver.scrollViewProps}
        {..._.omit(props, 'onScroll')}
      />
    );
  }
}

const StyledScrollView = connectStyle('shoutem.ui.ScrollView')(ScrollView);

function getRNScrollViewComponent(context) {
  // wrappedInstance.wrappedInstance._component:
  //   1st wrappedInstance -> StyledScrollView
  //   2nd wrappedInstance -> ScrollView (Shoutem UI)
  //   _component -> Animated.ScrollView
  // more info about _component: https://stackoverflow.com/questions/42051368/scrollto-is-undefined-on-animated-scrollview
  return _.get(context, 'wrappedInstance.wrappedInstance._component');
}

StyledScrollView.prototype.scrollTo = function scrollTo(coordinates) {
  const scrollView = getRNScrollViewComponent(this);
  if (scrollView) {
    scrollView.scrollTo(coordinates);
  }
};

StyledScrollView.prototype.scrollToEnd = function scrollToEnd(animation) {
  const scrollView = getRNScrollViewComponent(this);
  if (scrollView) {
    scrollView.scrollToEnd(animation);
  }
};

export { StyledScrollView as ScrollView };
