import React from 'react';
import _ from 'lodash';

import { View } from '../../components/View';
import { Text } from '../../components/Text';
import { removeWhiteSpace, isText } from './Text';
import { isImg } from './Img';
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
 * Get the leaf child of the element
 * @param element
 * @returns {*}
 */
function getLeafChild(element) {
  if (!element) {
    return;
  }
  if (_.isString(element) || _.size(element.childElements) === 0) {
    return element;
  }
  return getLeafChild(_.last(element.childElements));
}

/**
 * Handle element that breaks the line.
 * It will add br before the image element.
 * @param elements Elements to render in the Inline component
 * @param inlineElements Grouped inline elements
 * @param nextBlockElement The element which caused the line break
 */
function breakLineHandle(elements, inlineElements = [], nextBlockElement) {
  const lastElement = getLeafChild(_.last(inlineElements));

  if (isImg(nextBlockElement) && isText(lastElement)) {
    inlineElements.push({ tag: 'br' });
  }

  elements.push(nextBlockElement);
}

/**
 * Group connected (in a sequence) inline elements into array,
 * handle block elements with onBreakLine.
 *
 * For example:
 *  [i,i,i,b,i] => [[i,i,i], b, [i]]
 *
 * @param childElements {Array}
 * @returns {Array}
 */
function groupInlineNodes(childElements, onBreakLine) {
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
      onBreakLine(result, last, elem);
    }

    return result;
  }, []);
}

/**
 * @param groupedChildren {Array}
 *  List of elements and arrays of grouped inline elements.
 *  Check {@link groupInlineNodes}
 * @param renderElement {Function}
 * @returns {Children} React Children
 */
function renderGroupedChildren(groupedChildren, renderElement) {
  // eslint-disable-next-line prefer-arrow-callback
  const renderedChildren = groupedChildren.map(function (child) {
    if (_.isArray(child)) {
      // Inline elements must be wrapped with text to stay in the same line.
      // Inline elements are grouped in the array, see {@link groupInlineNodes}
      return <Text>{renderChildElements(child, renderElement)}</Text>;
    }
    return renderElement(child);
  });

  return React.Children.toArray(renderedChildren);
}

// TODO
// Refactr Inline to the Class component.
// Implement groupInlineNodes as a method.
// Add shouldBreakLine prop to get even more flexibility.
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
  const { childElements, style, renderElement, onPress, onBreakLine } = props;

  if (childElements.length < 1) {
    return null;
  }

  // Browsers ignore white space (new lines) around element tags,
  // we need to remove it here manually so it doesn't get rendered by RN.
  const trimmedChildren = removeWhiteSpace(childElements);

  // Group inline elements, such as text, so that
  // it gets shown in the same line. Like concatenation.
  // Block elements are standalone because they break the line.
  const children = groupInlineNodes(trimmedChildren, onBreakLine);

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

Inline.propTypes = {
  ...ElementPropTypes,
  onPress: React.PropTypes.func,
  onBreakLine: React.PropTypes.func,
};

Inline.defaultProps = {
  onBreakLine: breakLineHandle,
};

export const InlineSettings = { display: blockDisplayIfAnyChildIsBlock };

export default combineMappers(mapElementProps)(Inline);
