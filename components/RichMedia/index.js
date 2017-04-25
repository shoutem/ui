import RichMedia, {
  Display,
  richMediaConnectStyle,
  customizeRenderElement,
  ElementPropTypes,
  hasBlockElement,
  mapComponentProps,
  mapElementProps,
  renderChildElements,
  renderChildren,
} from './components/RichMedia';
import RichMediaGallery from './components/RichMediaGallery';
import RichMediaImage from './components/RichMediaImage';
import Inline, { InlineSettings } from './elements/Inline';
import Virtual from './elements/Virtual';
import Block from './elements/Block';
import Text from './elements/Text';
import { Ul, Ol, Li } from './elements/list';
import Img from './elements/Img';
import A from './elements/A';


// Text elements with primary inline display
RichMedia.registerElement('em', richMediaConnectStyle('em')(Inline), InlineSettings);
RichMedia.registerElement('i', richMediaConnectStyle('i')(Inline), InlineSettings);
RichMedia.registerElement('strong', richMediaConnectStyle('strong')(Inline), InlineSettings);
RichMedia.registerElement('b', richMediaConnectStyle('b')(Inline), InlineSettings);
RichMedia.registerElement('span', richMediaConnectStyle('span')(Inline), InlineSettings);

// Functional
RichMedia.registerElement('a', richMediaConnectStyle('a')(A), InlineSettings);
RichMedia.registerElement('img', Img);

// Containers
RichMedia.registerElement('header', richMediaConnectStyle('header')(Virtual));
RichMedia.registerElement('content', richMediaConnectStyle('content')(Virtual));
RichMedia.registerElement('article', richMediaConnectStyle('article')(Virtual));
RichMedia.registerElement('footer', richMediaConnectStyle('footer')(Virtual));
RichMedia.registerElement('section', richMediaConnectStyle('section')(Virtual));

// List
RichMedia.registerElement('ul', Ul);
RichMedia.registerElement('ol', Ol);

// Text base
RichMedia.registerElement('text', Text, { display: Display.INLINE });

// Text elements with block display
RichMedia.registerElement('h1', richMediaConnectStyle('h1')(Block));
RichMedia.registerElement('h2', richMediaConnectStyle('h2')(Block));
RichMedia.registerElement('h3', richMediaConnectStyle('h3')(Block));
RichMedia.registerElement('h4', richMediaConnectStyle('h4')(Block));
RichMedia.registerElement('h5', richMediaConnectStyle('h5')(Block));
RichMedia.registerElement('h6', richMediaConnectStyle('h6')(Block));
RichMedia.registerElement('p', richMediaConnectStyle('p')(Block));
RichMedia.registerElement('div', richMediaConnectStyle('div')(Block));

export {
  RichMedia,
  Display,
  richMediaConnectStyle,
  customizeRenderElement,
  ElementPropTypes,
  hasBlockElement,
  mapComponentProps,
  mapElementProps,
  renderChildElements,
  renderChildren,

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
  RichMediaGallery,
  RichMediaImage,
};
