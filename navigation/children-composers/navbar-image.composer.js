import React from 'react';
import _ from 'lodash';
import { NavigationBar } from '../NavigationBar';
import { Image } from '../../index';

const imageFitContainer = navBarProps => (NavigationBar.fitContainer || navBarProps.fitContainer);

const interpolateNavBarStyle = navBarProps => (
  _.get(navBarProps, 'style.navigationBarImage') || {}
);

const interpolateNavBarProps = (navBarProps) => {
  const { animationName } = navBarProps;
  const newProps = {
    resizeMode: imageFitContainer(navBarProps) ? 'cover' : 'contain',
    resizeMethod: imageFitContainer(navBarProps) ? 'scale' : 'auto',
  };

  if (animationName) {
    _.assign(newProps, {
      animationName: 'solidifyOpacity',
    });
  }
  return newProps;
};

const createNavBarComposer = navBarProps => () => {
  const navigationBarImage =
    (NavigationBar.globalNavigationBarImage || navBarProps.navigationBarImage);

  return (
    <Image
      source={{ uri: navigationBarImage }}
      style={interpolateNavBarStyle(navBarProps)}
      {...interpolateNavBarProps(navBarProps)}
    />
  );
};

const NavBarComposer = {
  canCompose(navBarProps) {
    return !!(NavigationBar.globalNavigationBarImage || navBarProps.navigationBarImage);
  },
  compose(navBarProps) {
    return {
      renderBackgroundImage: createNavBarComposer(navBarProps),
    };
  },
};

export default NavBarComposer;
