import React, { PureComponent } from 'react';
import { Animated, Platform, StatusBar, View } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import color from 'tinycolor2';
import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';
import { Device } from '../../helpers';
import composeChildren from './composeChildren';

function getBackgroundColor(style) {
  const styleWithBg = _.find(
    style,
    styleDef =>
      styleDef.backgroundColor && styleDef.backgroundColor !== 'transparent',
  );

  return (styleWithBg && styleWithBg.backgroundColor) || 'transparent';
}

// eslint-disable-next-line react/prefer-stateless-function
class NavigationBar extends PureComponent {
  setStatusBarStyle(backgroundColor) {
    function chooseBarStyle(bgColor) {
      return color(bgColor).isDark() ? 'light-content' : 'dark-content';
    }

    function setStyle(bgColor) {
      const statusBarColor = _.get(this.props, 'statusBarColor', bgColor);

      const color = statusBarColor || bgColor;

      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('rgba(0, 0, 0, 0.2)');
      } else {
        const barStyle = chooseBarStyle(color);
        StatusBar.setBarStyle(barStyle);
      }
    }

    // This is little bit hacky, but is the only way
    // to determine the current value of interpolated Animated.Value
    // Other way would be to ask developer to provide Animated.Value
    // used to interpolate backgroundColor. But this way developer doesn't
    // have to concern about status bar if he animates navigation bar color
    if (backgroundColor && backgroundColor._parent instanceof Animated.Value) {
      backgroundColor._parent.addListener(animation => {
        setStyle(backgroundColor._interpolation(animation.value));
      });
      setStyle(backgroundColor._interpolation(0));
    } else {
      setStyle(backgroundColor);
    }
  }

  renderStatusBar() {
    const { style } = this.props;

    return Device.select({
      iPhoneX: <View style={style.statusBar} />,
      default: null,
    });
  }

  render() {
    const {
      leftComponent,
      rightComponent,
      centerComponent,
      style,
      id,
    } = this.props;

    const backgroundColor = getBackgroundColor(style);
    this.setStatusBarStyle(backgroundColor);
    // Key must be set to render new screen NavigationBar
    return (
      <Animated.View style={style.container} key={id}>
        {this.renderStatusBar()}
        <View style={style.componentsContainer}>
          <View style={style.leftComponent}>{leftComponent}</View>
          <View style={style.centerComponent}>{centerComponent}</View>
          <View style={style.rightComponent}>{rightComponent}</View>
        </View>
      </Animated.View>
    );
  }
}

NavigationBar.propTypes = {
  style: PropTypes.object.isRequired,
  centerComponent: PropTypes.node,
  id: PropTypes.string,
  leftComponent: PropTypes.node,
  rightComponent: PropTypes.node,
  // eslint-disable-next-line react/no-unused-prop-types
  statusBarColor: PropTypes.string,
};

NavigationBar.defaultProps = {
  id: 'default',
  leftComponent: undefined,
  centerComponent: undefined,
  rightComponent: undefined,
  statusBarColor: undefined,
};

const AnimatedNavigationBar = connectAnimation(composeChildren(NavigationBar));
const StyledNavigationBar = connectStyle('shoutem.ui.NavigationBar')(
  AnimatedNavigationBar,
);

export { StyledNavigationBar as NavigationBar };
