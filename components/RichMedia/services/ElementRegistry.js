import _ from 'lodash';

/**
 * Contains RN element class (description) for corresponding element tag.
 * @type {{ elementTag: { component, display, mapAttributes } }} - elementTag: ElementClass
 */
const ElementRegistry = {};

export function registerElement(elementTag, elementClass) {
  ElementRegistry[elementTag] = elementClass;
}

export function getElement(element) {
  const { tag } = element;
  return ElementRegistry[tag];
}

export function getElementProperty(element, property) {
  return _.get(getElement(element), property);
}

export function getElementDisplay(element) {
  const display = getElementProperty(element, 'display');

  if (!display) {
    console.warn(`Element ${element.tag} doesn't have defined "display" attribute.`);
  }

  return _.isFunction(display) ? display(element) : display;
}
