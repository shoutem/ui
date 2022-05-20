import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '../View';
import Category from './Category';
import { categoryShape } from './shapes';

export function CategoryPicker({
  categories,
  onCategorySelected,
  style,
  selectedCategory,
}) {
  const renderItem = useCallback(
    ({ item: category }) => (
      <Category
        category={category}
        key={category.id}
        onPress={onCategorySelected}
        isSelected={selectedCategory.id === category.id}
      />
    ),
    [selectedCategory.id, onCategorySelected],
  );

  if (_.size(categories) < 2) {
    return null;
  }

  return (
    <View style={style.container}>
      <FlatList
        horizontal
        scrollToOverflowEnabled
        contentContainerStyle={style.listContainer}
        showsHorizontalScrollIndicator={false}
        data={categories}
        renderItem={renderItem}
      />
    </View>
  );
}

CategoryPicker.propTypes = {
  categories: PropTypes.arrayOf(categoryShape),
  selectedCategory: categoryShape,
  style: PropTypes.object,
  onCategorySelected: PropTypes.func,
};

CategoryPicker.defaultProps = {
  categories: [],
  style: {},
  selectedCategory: undefined,
  onCategorySelected: undefined,
};

export default React.memo(
  connectStyle('shoutem.ui.CategoryPicker')(CategoryPicker),
);
