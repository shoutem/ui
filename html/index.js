import Gallery from './components/Gallery';
import Image from './components/Image';
import SimpleHtml from './components/SimpleHtml';
import A from './elements/A';
import Block from './elements/Block';
import Br from './elements/Br';
import Img from './elements/Img';
import Inline, { InlineSettings } from './elements/Inline';
import { Bullet, Li, Number, Ol, Ul } from './elements/list';
import Text from './elements/Text';
import Video from './elements/Video';
import Virtual from './elements/Virtual';
import {
  Display,
  getElement,
  getElementDisplay,
  getElementProperty,
  registerElement,
} from './services/ElementRegistry';
import Html, {
  combineMappers,
  customizeRenderElement,
  ElementPropTypes,
  hasBlockElement,
  mapElementProps,
  renderChildElements,
  renderChildren,
} from './Html';

// Text elements with primary inline display
Html.registerElement('em', Inline, InlineSettings);
Html.registerElement('i', Inline, InlineSettings);
Html.registerElement('strong', Inline, InlineSettings);
Html.registerElement('b', Inline, InlineSettings);
Html.registerElement('span', Inline, InlineSettings);
Html.registerElement('blockquote', Inline, InlineSettings);

// Functional
Html.registerElement('a', A, InlineSettings);
Html.registerElement('img', Img);
Html.registerElement('br', Br, InlineSettings);
Html.registerElement('video', Video);

// Containers
Html.registerElement('header', Virtual);
Html.registerElement('content', Virtual);
Html.registerElement('article', Virtual);
Html.registerElement('footer', Virtual);
Html.registerElement('section', Virtual);

// List
Html.registerElement('ul', Ul);
Html.registerElement('ol', Ol);
Html.registerElement('li', Li);
Html.registerElement('bullet', Bullet, { display: Display.INLINE });
Html.registerElement('number', Number, { display: Display.INLINE });

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
  A,
  Block,
  combineMappers,
  customizeRenderElement,
  // Element Registry
  Display,
  ElementPropTypes,
  // Components
  Gallery,
  getElement,
  getElementDisplay,
  getElementProperty,
  hasBlockElement,
  Html,
  Image,
  Img,
  // Elements
  Inline,
  Li,
  mapElementProps,
  Ol,
  registerElement,
  renderChildElements,
  renderChildren,
  SimpleHtml,
  Ul,
  Virtual,
};
