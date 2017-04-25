import _ from 'lodash';

/**
 * Contains RN element class (description) for corresponding element tag.
 * @type {{ elementTag: { component, display, mapAttributes } }} - elementTag: ElementClass
 */
const ElementsClassMap = {};

export function addElementClass(elementTag, elementClass) {
  ElementsClassMap[elementTag] = elementClass;
}

export function getElementClass(element) {
  const { tag } = element;
  return ElementsClassMap[tag];
}

export function getElementClassAttribute(element, attribute) {
  return _.get(getElementClass(element), attribute);
}

export function getElementDisplay(element) {
  const display = getElementClassAttribute(element, 'display');

  if (!display) {
    console.warn(`Element ${element.tag} doesn't have defined "display" attribute.`);
  }

  return _.isFunction(display) ? display(element) : display;
}
