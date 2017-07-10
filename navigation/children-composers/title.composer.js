import React from 'react';
import _ from 'lodash';
import {
  View,
  Title,
} from '../../index';
import { NavigationBar } from '../NavigationBar';

function hasBackgroundImage(navBarProps) {
  return (NavigationBar.globalNavigationBarImage || navBarProps.navigationBarImage);
}

/**
 * Check if title should be displayed or now
 * @param {bool} showTitle
 */
function canShowTitle(navBarProps) {
  if (!hasBackgroundImage(navBarProps)) {
    return true;
  } else if (NavigationBar.showTitle === false) {
    return false;
  }
  return NavigationBar.showTitle;
}

const createTitle = navBarProps => () => {
  const value = navBarProps.title;
  return (
    <View virtual styleName="container">
      <Title animationName={navBarProps.animationName} numberOfLines={1}>
        {value || ''}
      </Title>
    </View>
  );
};

const TitleComposer = {
  canCompose(navBarProps) {
    const value = navBarProps.title;
    return (!!value && canShowTitle(navBarProps));
  },
  compose(navBarProps) {
    return {
      renderTitleComponent: createTitle(navBarProps),
    };
  },
};

export default TitleComposer;
