import React, { PureComponent } from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';
import autoBind from 'auto-bind/react';
import _ from 'lodash';

import { ScrollDriver, DriverShape } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

import { Device } from '../../helpers';
import { ScrollDriverProvider } from './ScrollDriverProvider.js';

const isTabBarOnScreen = true;
const IPHONE_X_HOME_INDICATOR_PADDING = isTabBarOnScreen ? 0 : 34;

function addIphoneXPadding(style) {
  const resolvedStyle = style;
  if (typeof resolvedStyle.paddingBottom !== 'number') {
    resolvedStyle.paddingBottom = 0;
  }

  resolvedStyle.paddingBottom = Device.select({
    iPhoneX: resolvedStyle.paddingBottom + IPHONE_X_HOME_INDICATOR_PADDING,
    default: resolvedStyle.paddingBottom,
  });

  return resolvedStyle;
}

class ScrollView extends PureComponent {
  static propTypes = {
    ...Animated.ScrollView.propTypes,
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

    autoBind(this);

    this.animationDriver = props.driver || new ScrollDriver({ useNativeDriver: true });
  }

  getChildContext() {
    return {
      animationDriver: this.animationDriver,
    };
  }

  componentDidMount() {
    const { primary } = this.props;
    const { driverProvider } = this.context;

    if (driverProvider) {
      driverProvider.setAnimationDriver(this.animationDriver, primary);
    }
  }

  componentDidUpdate() {
    const { driver } = this.props;
    const { animationDriver } = this.context;

    if (driver && this.animationDriver !== driver) {
      this.animationDriver = driver;
    } else if (animationDriver && this.animationDriver !== animationDriver) {
      this.animationDriver = animationDriver;
    }
  }

  setWrappedInstance(component) {
    this.wrappedInstance = component;
  }

  render() {
    const { style: { contentContainerStyle } } = this.props;
    const cleanProps = _.omit(this.props, 'style.contentContainerStyle');

    return (
      <Animated.ScrollView
        ref={this.setWrappedInstance}
        contentContainerStyle={addIphoneXPadding(contentContainerStyle)}
        {...this.animationDriver.scrollViewProps}
        {...cleanProps}
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

export {
  StyledScrollView as ScrollView,
};
