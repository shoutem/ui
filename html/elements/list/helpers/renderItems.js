import React from 'react';
import _ from 'lodash';

import { createElementNode } from '../../../services/HtmlParser';

export default function renderItems(childElements, renderElement, createPrefixElement) {
  const renderedComponents = _.reduce(childElements, (items, element, index) => {
    const { childElements: itemChildElements } = element;

    const prefix = createPrefixElement ? createPrefixElement(element, index) : null;
    const childElements = prefix ? [prefix, ...itemChildElements] : itemChildElements;

    const elem = {
      ...element,
      childElements,
    };

    items.push(renderElement(elem));
    return items;
  }, []);

  return React.Children.toArray(renderedComponents);
}
