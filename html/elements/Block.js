import React from 'react';
import _ from 'lodash';

import { ElementPropTypes, combineMappers, mapElementProps, isBlockElement } from '../Html';
import { Inline } from './Inline';

/**
 * Should be used for the block HTML elements.
 * The Block behaves the same as the HTML block element,
 * it moves the content into a new line.
 * @param props {Object} Element attributes
 * @returns {Component}
 * @constructor
 */
export function Block(props) {
  const { style, childElements } = props;
  const lastChild = _.last(childElements);

  // Wrapper is a block element that contains another block elements as the last leaf child.
  // In this case, the wrapper element doesn't need the bottom margin because
  // the last leaf child will add the margin.
  const styleName = lastChild && isBlockElement(lastChild) ? 'wrapper' : undefined;

  return <Inline {...props} styleName={styleName} block />;
}

Block.propTypes = {
  ...ElementPropTypes,
};

export default combineMappers(mapElementProps)(Block);
