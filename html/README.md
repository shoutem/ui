# Html

## Html component
Transforms the raw HTML to the React Native components tree.
 Accepts these props:

- `body` A raw HTML.
- `renderElement(element, style, defaultRenderElement)` A function to override default `renderElement`. If this function returns `undefined` the default `renderElement` will be used to render element.
- `style` A Html style.

Register an element with the static `Html.registerElement(elementTag, Component)` method.
 Registered elements will be handled with the default `renderElement`.

### Components
Components in the `html/components` folder are base implementation of common HTML elements that contain specific logic.
 Wrap those components with your own element implementation, and reduce the element attributes to the component props.
 
 For example, there are different ways to implement the HTML image gallery but most the most cases you can use the same React Native implementation.  

## Element components
Elements are React Native components used to render a parsed element.
 The Element will by default receives these props:
 
- `element` An object describing element, contains `tag`, `attributes`, `childElements`, `parent` props.
- `style` The [Shoutem theme](https://github.com/shoutem/theme) style passed in the Html instance style.
- `renderElement` A function used to render an element with registered element component.

