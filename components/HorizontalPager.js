import React, {
  PropTypes,
} from 'react';

import {
  ScrollView,
  ViewPagerAndroid,
  Platform,
  View,
} from 'react-native';

import { connectStyle } from '@shoutem/theme';

const propTypes = {
  height: PropTypes.number.isRequired,
  dataSource: PropTypes.arrayOf(PropTypes.string),
  renderPage: PropTypes.func,
  style: PropTypes.object,
};

/**
 * Renders a horizontal pager which renders pages by using
 * the provided renderPage function with data from provided
 * dataSource.
 *
 * It can be used as a general wrapper component for any group
 * of uniform components which require horizontal paging.
 * It abstracts away React Native API inconsistencies between
 * iOS and Android platforms and should be used instead of
 * ScrollView and ViewPagerAndroid for this matter.
 *
 * @returns {*}
 */
function HorizontalPager({
  height,
  dataSource,
  renderPage,
  style,
}) {
  const pages = dataSource.map((src, key) => (
    <View style={style.item} key={key} >
      {renderPage(src, key)}
    </View>
  ));

  if (Platform.OS === 'android') {
    return (
      <ViewPagerAndroid
        style={{ height }}
        initialPage={0}
      >
        {pages}
      </ViewPagerAndroid>
    );
  }

  return (
    <ScrollView
      pagingEnabled
      horizontal
    >
      {pages}
    </ScrollView>
  );
}

HorizontalPager.propTypes = propTypes;

const StyledHorizontalPager = connectStyle('shoutem.ui.HorizontalPager', {})(HorizontalPager);

export {
  StyledHorizontalPager as HorizontalPager,
};
