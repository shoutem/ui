import React from 'react';
import { Text } from 'react-native';
import _ from 'lodash';
import { AllHtmlEntities as Entities } from 'html-entities';

import { ElementPropTypes, combineMappers, mapElementProps } from '../Html';

const html = new Entities();

function isWhiteSpaceWrappedWithText(element) {
  return _.size(element.childElements) === 1 && isWhiteSpaceString(element.childElements[0]);
}

function isWhiteSpaceString(element) {
  return _.isString(element) && element.trim().length === 0;
}

function isWhiteSpace(element) {
  return isWhiteSpaceString(element) || isWhiteSpaceWrappedWithText(element);
}

export function isText(element) {
  const elementTag = _.get(element, 'tag');
  return _.isString(element) || elementTag === 'text';
}

export function removeWhiteSpace(childElements) {
  return childElements.filter(child => !isWhiteSpace(child));
}

export function decodeHtmlEntities(childElements) {
  return _.map(childElements, (element) => _.isString(element) ? html.decode(element) : element);
}

export function TextElement(props) {
  // Remove empty white space lines used just to move element in new line.
  // Use "p" or "br" to add new line.
  const textualChildElements = decodeHtmlEntities(removeWhiteSpace(props.childElements));

  if (textualChildElements.length === 0) {
    // Even if there is no children to render, the Text must be rendered
    // because otherwise RN may render a View to wrap a "null" which may lead to
    // a case where a View is in the Text.
    return <Text style={{ height: 0 }} />;
  }

  // Must be the RN Text so that style inheritance chain
  // doesn't break with additional layer.
  return <Text {...props}>{textualChildElements}</Text>;
}

TextElement.propTypes = {
  ...ElementPropTypes,
};

export default combineMappers(mapElementProps)(TextElement);
