import _ from 'lodash';

/**
 * Contains RN element class (description) for corresponding element tag.
 * @type {{ elementTag: { display } }} - elementTag: ElementClass
 */
const ElementRegistry = {};

/**
 * HTML elements have different display settings that affect React Native composition.
 * Use INLINE display for Text components that are stacked horizontally.
 * Use BLOCK display for any components that are stacked vertically.
 */
export const Display = {
  INLINE: 1,
  BLOCK: 2,
};

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
  const elementClass = getElement(element);
  if (!elementClass) {
    // Element is not registered.
    return;
  }

  const display = elementClass.display;
  if (!display) {
    console.warn(`Element ${element.tag} doesn't have defined "display" attribute.`);
  }

  return _.isFunction(display) ? display(element) : display;
}
