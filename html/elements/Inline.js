import React from 'react';
import _ from 'lodash';

import { View } from '../../components/View';
import { Text } from '../../components/Text';
import { removeWhiteSpace } from './Text';
import { TouchableOpacity } from '../../components/TouchableOpacity';
import { Display } from '../services/ElementRegistry';
import {
  isBlockElement,
  hasBlockElement,
  ElementPropTypes,
  combineMappers,
  mapElementProps,
  renderChildElements,
} from '../Html';

export const blockDisplayIfAnyChildIsBlock = function (element) {
  return hasBlockElement(element.childElements) ? Display.BLOCK : Display.INLINE;
};

/**
 * Based on {@link groupInlineNodes},
 * if all elements are inline there will only be one array.
 * @param groupedChildren {Array}
 * @returns {boolean}
 */
function isInline(groupedChildren) {
  const last = _.last(groupedChildren);
  return groupedChildren.length === 1 && _.isArray(last);
}

/**
 * Group connected (in a sequence) inline elements into array,
 * leave block elements.
 *
 * For example:
 *  [i,i,i,b,i] => [[i,i,i], b, [i]]
 *
 * @param childElements {Array}
 * @returns {Array}
 */
function groupInlineNodes(childElements) {
  // eslint-disable-next-line prefer-arrow-callback
  return childElements.reduce(function (result, elem) {
    let last = _.last(result);

    if (!isBlockElement(elem)) {
      if (!_.isArray(last)) {
        last = [];
        result.push(last);
      }
      last.push(elem);
    } else {
      result.push(elem);
    }

    return result;
  }, []);
}

/**
 * @param groupedChildren {Array} List of elements or elements array
 * @param renderElement {Function}
 * @returns {Children} React Children
 */
function renderGroupedChildren(groupedChildren, renderElement) {
  // eslint-disable-next-line prefer-arrow-callback
  const renderedChildren = groupedChildren.map(function (child) {
    if (_.isArray(child)) {
      return renderChildElements(child, renderElement);
    }
    return renderElement(child);
  });

  return React.Children.toArray(renderedChildren);
}

/**
 * Should be used for inline HTML elements.
 * Because of specific RN behavior, the inline component will remain inline
 * only if every child (recursively) is inline as well.
 * If any child is not inline, the display will be block.
 * A container element is added around the children only when
 * inline element is used as a block element.
 * @param props {Object} Element attributes
 * @returns {component}
 * @constructor
 */
export const Inline = function (props) {
  const { childElements, style, renderElement, onPress } = props;

  if (childElements.length < 1) {
    return null;
  }

  const trimmedChildren = removeWhiteSpace(childElements);
  const children = groupInlineNodes(trimmedChildren);
  const renderedChildren = renderGroupedChildren(children, renderElement);

  if (isInline(children)) {
    return <Text style={style.text} onPress={onPress}>{renderedChildren}</Text>;
  }

  const Container = onPress ? TouchableOpacity : View;
  return <Container style={style.container} onPress={onPress}>{renderedChildren}</Container>;
};

Inline.defaultProps = {
  style: {},
};

export const InlineSettings = { display: blockDisplayIfAnyChildIsBlock };

Inline.propTypes = {
  ...ElementPropTypes,
  onPress: React.PropTypes.func,
};

export default combineMappers(mapElementProps)(Inline);
