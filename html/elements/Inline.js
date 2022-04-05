import React, { PureComponent } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Text } from '../../components/Text';
import { TouchableOpacity } from '../../components/TouchableOpacity';
import { View } from '../../components/View';
import {
  combineMappers,
  ElementPropTypes,
  hasBlockElement,
  isBlockElement,
  mapElementProps,
  renderChildElements,
} from '../Html';
import { Display } from '../services/ElementRegistry';
import { isImg } from './Img';
import { isText, removeWhiteSpace } from './Text';

export const blockDisplayIfAnyChildIsBlock = function(element) {
  return hasBlockElement(element.childElements)
    ? Display.BLOCK
    : Display.INLINE;
};

/**
 * Based on {@link groupInlineNodes},
 * if all elements are inline there will only be one array.
 * @param groupedChildren {Array}
 * @returns {boolean}
 */
function onlyInlineChildren(groupedChildren) {
  const last = _.last(groupedChildren);

  return groupedChildren.length === 1 && _.isArray(last);
}

/**
 * Get the leaf child of the element
 * @param element
 * @returns {*}
 */
function getRightmostLeafChild(element) {
  if (!element) {
    return null;
  }

  if (_.isString(element) || _.size(element.childElements) === 0) {
    return element;
  }

  return getRightmostLeafChild(_.last(element.childElements));
}

/**
 * Handle element that breaks the line.
 * It will add br before the image element.
 * @param elements Elements to render in the Inline component
 * @param inlineElements Grouped inline elements
 * @param nextBlockElement The element which caused the line break
 */
function handleLineBreak(elements, inlineElements = [], nextBlockElement) {
  const lastElement = getRightmostLeafChild(_.last(inlineElements));

  if (isImg(nextBlockElement) && isText(lastElement)) {
    inlineElements.push({ tag: 'br' });
  }

  elements.push(nextBlockElement);
}

/**
 * Group connected (in a sequence) inline elements into array,
 * handle block elements with onLineBreak.
 *
 * For example:
 *  [i,i,i,b,i] => [[i,i,i], b, [i]]
 *
 * @param childElements {Array}
 * @returns {Array}
 */
function groupInlineNodes(childElements, onLineBreak) {
  // eslint-disable-next-line prefer-arrow-callback
  return childElements.reduce(function(result, elem) {
    let last = _.last(result);

    if (!isBlockElement(elem)) {
      if (!_.isArray(last)) {
        last = [];
        result.push(last);
      }
      last.push(elem);
    } else {
      onLineBreak(result, last, elem);
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
function renderGroupedChildren(groupedChildren, renderElement, style) {
  // eslint-disable-next-line prefer-arrow-callback
  const renderedChildren = groupedChildren.map(function(child) {
    if (_.isArray(child)) {
      // Inline elements must be wrapped with text to stay in the same line.
      // Inline elements are grouped in the array, see {@link groupInlineNodes}
      const renderedChild = renderChildElements(child, renderElement);

      return _.isEmpty(renderedChild) ? null : (
        <Text style={style.text}>{renderedChild}</Text>
      );
    }

    return renderElement(child);
  });

  return React.Children.toArray(renderedChildren);
}

// TODO
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
export class Inline extends PureComponent {
  render() {
    const {
      block,
      childElements,
      onPress,
      onLineBreak,
      renderElement,
      style,
      styleName,
    } = this.props;

    if (_.isEmpty(childElements)) {
      return null;
    }

    // Browsers ignore white space (new lines) around element tags,
    // we need to remove it here manually so it doesn't get rendered by RN.
    const trimmedChildren = removeWhiteSpace(childElements);

    // TODO - save prepared children (trimmed and grouped) in the state
    // Group inline elements, such as text, so that
    // it gets shown in the same line. Like concatenation.
    // Block elements are standalone because they break the line.
    const children = groupInlineNodes(trimmedChildren, onLineBreak);

    let content = renderGroupedChildren(children, renderElement, style);
    if (onlyInlineChildren(children)) {
      // Group textual nodes together.
      // Used for right text wrapping.
      content = (
        <Text onPress={onPress} styleName={styleName} selectable>
          {content}
        </Text>
      );

      // TODO - standardize block behavior
      if (!block) {
        return content;
      }
    }

    const Container = onPress ? TouchableOpacity : View;

    return (
      <Container
        style={style.container}
        onPress={onPress}
        styleName={`block ${styleName}`}
      >
        {content}
      </Container>
    );
  }
}

Inline.propTypes = {
  ...ElementPropTypes,
  style: PropTypes.object,
  onLineBreak: PropTypes.func,
  onPress: PropTypes.func,
};

Inline.defaultProps = {
  style: {},
  onLineBreak: handleLineBreak,
  onPress: undefined,
};

export const InlineSettings = { display: blockDisplayIfAnyChildIsBlock };

export default combineMappers(mapElementProps)(Inline);
