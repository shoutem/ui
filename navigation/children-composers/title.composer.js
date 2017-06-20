import React from 'react';
import _ from 'lodash';
import {
  View,
  Title,
} from '../../index';
import { NavigationBar } from '../NavigationBar';

/**
 * Check if title should be displayed or now
 * @param {bool} showTitle
 */
function canShowTitle(navBarProps, showTitle) {
  if (_.isUndefined(showTitle)) return true;
  if ((NavigationBar.globalNavigationBarImage || navBarProps.navigationBarImage) &&
      (showTitle === false)) return false;
  return !!showTitle;
}

const createTitleComposer = navBarProps =>
  () => {
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
    return (!!value && canShowTitle(navBarProps, NavigationBar.showTitle));
  },
  compose(navBarProps) {
    return {
      renderTitleComponent: createTitleComposer(navBarProps),
    };
  },
};

export default TitleComposer;
