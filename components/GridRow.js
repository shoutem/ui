import React, { Children } from 'react';
import { View as RNView } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { View } from './View';
import { connectStyle } from '@shoutem/theme';
import { connectAnimation } from '@shoutem/animation';

/**
 * Renders empty placeholder views to fill any empty space
 * left by missing views within a row. This is necessary so that
 * the items in a row remain aligned correctly.
 *
 * @param count Number of placeholders to render
 * @returns {*} Placeholder views
 */
function renderPlaceholderViews(count) {
  return _.times(count, (index) => (<View key={`placeholder-${index}`} />));
}

// Ref needed
// eslint-disable-next-line react/prefer-stateless-function
class GridRow extends React.Component {
  render() {
    const { children, columns } = this.props;
    const missingElementsCount = columns - Children.count(children);

    return (
      <RNView {...this.props}>
        {children}
        {renderPlaceholderViews(missingElementsCount)}
      </RNView>
    );
  }
}

GridRow.propTypes = {
  columns: PropTypes.number.isRequired,
  ...RNView.propTypes,
};

/* eslint-disable no-param-reassign */
/**
 * Groups data into rows for rendering in grid views.
 * Elements may need more than one column in the grid.
 * To accomplish this, a column span can be assigned to
 * each element. The column span of an element determines
 * the number of columns it should occupy.
 *
 * @param data The data elements to group.
 * @param columns The number of columns of the grid.
 * @param getColumnSpan Optional function that returns the
 *   column span of a single element. Each element has a span
 *   of 1 by default.
 * @returns {Array} An array of rows, each row is an array of
 *   data elements.
 */
GridRow.groupByRows = (data, columns, getColumnSpan = _.constant(1)) => {
  const groupedData = _.reduce(data, (result, element) => {
    let currentRow = _.last(result.rows);
    const elementSpan = getColumnSpan(element);

    if (!currentRow || (result.currentRowSize + elementSpan > columns)) {
      currentRow = [];
      result.currentRowSize = 0;
      result.rows.push(currentRow);
    }

    result.currentRowSize += elementSpan;
    currentRow.push(element);
    return result;
  }, { currentRowSize: 0, rows: [] });

  return groupedData.rows;
};

const AnimatedGridRow = connectAnimation(GridRow);
const StyledGridRow = connectStyle('shoutem.ui.GridRow')(AnimatedGridRow);

export {
  StyledGridRow as GridRow,
};
