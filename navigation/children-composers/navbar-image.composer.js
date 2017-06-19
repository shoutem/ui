import React from 'react';
import _ from 'lodash';
import {
  NavigationExperimental,
  Dimensions,
} from 'react-native';
import { NavigationBar } from '../NavigationBar';
import { Image } from '../../index';

const {
  Header: NavigationHeader,
} = NavigationExperimental;

const navigationHeaderBackgroundImageStyle = {
  flex: 1,
  flexGrow: 1,
  left: 0,
  height: NavigationHeader.HEIGHT,
  position: 'absolute',
  right: 0,
  top: 0,
  width: Dimensions.get('window').width,

  solidifyOpacityAnimation(driver) {
    return {
      opacity: driver.interpolate({
        inputRange: [250, 300],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
    };
  },
};

const interpolateNavBarProps = (navBarProps) => {
  const newProps = {};
  const { animationName } = navBarProps;

  if (animationName) {
    _.assign(newProps, {
      animationName: 'solidifyOpacity',
    });
  }
  return newProps;
};

const NavBarComposer = {
  canCompose(navBarProps) {
    return (!!NavigationBar.globalNavigationBarImage || !!navBarProps.navigationBarImage);
  },
  compose(navBarProps) {
    return { renderBackgroundImage() {
      let navigationBarImage = NavigationBar.globalNavigationBarImage;
      if (navBarProps && navBarProps.navigationBarImage) {
        navigationBarImage = navBarProps.navigationBarImage;
      }

      const NavBarImage = (
        <Image
          source={{ uri: navigationBarImage }}
          style={navigationHeaderBackgroundImageStyle}
          resizeMode="cover"
          resizeMethod="resize"
          {...interpolateNavBarProps(navBarProps)}
        />
      );
      return NavBarImage;
    } };
  },
};

export default NavBarComposer;
