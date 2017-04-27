import {
  registerElement,
  Display,
  getElementDisplay,
  getElementProperty,
  getElement,
} from './services/ElementRegistry';
import Html, {
  richMediaConnectStyle,
  customizeRenderElement,
  ElementPropTypes,
  hasBlockElement,
  mapComponentProps,
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
Html.registerElement('em', richMediaConnectStyle('em')(Inline), InlineSettings);
Html.registerElement('i', richMediaConnectStyle('i')(Inline), InlineSettings);
Html.registerElement('strong', richMediaConnectStyle('strong')(Inline), InlineSettings);
Html.registerElement('b', richMediaConnectStyle('b')(Inline), InlineSettings);
Html.registerElement('span', richMediaConnectStyle('span')(Inline), InlineSettings);

// Functional
Html.registerElement('a', richMediaConnectStyle('a')(A), InlineSettings);
Html.registerElement('img', Img);

// Containers
Html.registerElement('header', richMediaConnectStyle('header')(Virtual));
Html.registerElement('content', richMediaConnectStyle('content')(Virtual));
Html.registerElement('article', richMediaConnectStyle('article')(Virtual));
Html.registerElement('footer', richMediaConnectStyle('footer')(Virtual));
Html.registerElement('section', richMediaConnectStyle('section')(Virtual));

// List
Html.registerElement('ul', Ul);
Html.registerElement('ol', Ol);

// Text base
Html.registerElement('text', Text, { display: Display.INLINE });

// Text elements with block display
Html.registerElement('h1', richMediaConnectStyle('h1')(Block));
Html.registerElement('h2', richMediaConnectStyle('h2')(Block));
Html.registerElement('h3', richMediaConnectStyle('h3')(Block));
Html.registerElement('h4', richMediaConnectStyle('h4')(Block));
Html.registerElement('h5', richMediaConnectStyle('h5')(Block));
Html.registerElement('h6', richMediaConnectStyle('h6')(Block));
Html.registerElement('p', richMediaConnectStyle('p')(Block));
Html.registerElement('div', richMediaConnectStyle('div')(Block));

export {
  Html,
  richMediaConnectStyle,
  customizeRenderElement,
  ElementPropTypes,
  hasBlockElement,
  mapComponentProps,
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
