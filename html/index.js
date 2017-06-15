import {
  registerElement,
  Display,
  getElementDisplay,
  getElementProperty,
  getElement,
} from './services/ElementRegistry';
import Html, {
  customizeRenderElement,
  ElementPropTypes,
  hasBlockElement,
  combineMappers,
  mapElementProps,
  renderChildElements,
  renderChildren,
} from './Html';
import Gallery from './components/Gallery';
import Image from './components/Image';
import Inline, { InlineSettings } from './elements/Inline';
import Virtual from './elements/Virtual';
import Block from './elements/Block';
import Text from './elements/Text';
import { Ul, Ol, Li } from './elements/list';
import Img from './elements/Img';
import A from './elements/A';

// Text elements with primary inline display
Html.registerElement('em', Inline, InlineSettings);
Html.registerElement('i', Inline, InlineSettings);
Html.registerElement('strong', Inline, InlineSettings);
Html.registerElement('b', Inline, InlineSettings);
Html.registerElement('span', Inline, InlineSettings);

// Functional
Html.registerElement('a', A, InlineSettings);
Html.registerElement('img', Img);

// Containers
Html.registerElement('header', Virtual);
Html.registerElement('content', Virtual);
Html.registerElement('article', Virtual);
Html.registerElement('footer', Virtual);
Html.registerElement('section', Virtual);

// List
Html.registerElement('ul', Ul);
Html.registerElement('ol', Ol);

// Text base
Html.registerElement('text', Text, { display: Display.INLINE });

// Text elements with block display
Html.registerElement('h1', Block);
Html.registerElement('h2', Block);
Html.registerElement('h3', Block);
Html.registerElement('h4', Block);
Html.registerElement('h5', Block);
Html.registerElement('h6', Block);
Html.registerElement('p', Block);
Html.registerElement('div', Block);

export {
  Html,
  customizeRenderElement,
  ElementPropTypes,
  hasBlockElement,
  combineMappers,
  mapElementProps,
  renderChildElements,
  renderChildren,

  // Element Registry
  Display,
  registerElement,
  getElementDisplay,
  getElementProperty,
  getElement,

  // Elements
  Inline,
  Block,
  Img,
  A,
  Ul,
  Ol,
  Li,
  Virtual,

  // Components
  Gallery,
  Image,
};
