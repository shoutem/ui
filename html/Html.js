import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Spinner } from '../components/Spinner';
import { View } from '../components/View';
import {
  Display,
  getElement,
  getElementDisplay,
  getElementProperty,
  registerElement,
} from './services/ElementRegistry';
import { parseHtml } from './services/HtmlParser';

const defaultElementSettings = {
  display: Display.BLOCK,
};

class Html extends PureComponent {
  static propTypes = {
    body: PropTypes.string.isRequired,
    renderElement: PropTypes.func,
    style: PropTypes.object,
  };

  /**
   * Create Element class for given element tag and add it to the ElementClassMap.
   * Use the settings to additionally describe a Element class.
   * @param elementTag {string} HTML element tag
   * @param component {Component} React Native Component
   * @param settings {Object} Default settings override
   *   Most times a developer will only want to override one setting,
   *   that's why settings are merged with defaultElementSettings.
   * @param settings.display {Display || Function}
   *   Describe component display.
   *   Can be a function to dynamically resolve display.
   */
  static registerElement(elementTag, component, settings = {}) {
    const elementSettings = _.assign({}, defaultElementSettings, settings);

    registerElement(elementTag, { ...elementSettings, component });
  }

  static getElement(tag) {
    // TODO - standardize ElementRegistry getElement
    return getElement({ tag });
  }

  static getDerivedStateFromProps(props, state) {
    const htmlTree = props.body ? parseHtml(props.body) : false;

    if (htmlTree && state.htmlTree === htmlTree) {
      return state;
    }

    return { htmlTree };
  }

  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    this.state = {
      htmlTree: null,
    };
  }

  /**
   * Get element style from the Html instance style.
   * @param element {Element}
   * @returns {Object|undefined}
   */
  getElementStyle({ tag }) {
    const { style } = this.props;
    return _.get(style, tag, {});
  }

  /**
   * Render HTML element as React Native component.
   * This method is passed to both custom renderElement and
   * element corresponding component. It is also used to render children
   * and should be passed down the tree so that children can be rendered.
   * If Html has style named by element tag it will be passed to rendered element.
   * @param element {Element} Parsed HTML element
   * @returns {Component} The element rendered as a React Native component
   */
  renderElement(element) {
    const elementStyle = this.getElementStyle(element);
    let renderedElement;

    if (this.props.renderElement) {
      renderedElement = this.props.renderElement(
        element,
        elementStyle,
        this.renderElement,
      );
    }

    // Custom renderElement for the specific Html implementation
    // has advantage over the "global". If custom renderElement rendered
    // a component that component will be used, otherwise fallback to "global".
    // Render element must be undefined to fallback to default,
    // null is a valid RN type to render.
    if (_.isUndefined(renderedElement)) {
      const ElementComponent = getElementProperty(element, 'component');

      if (!ElementComponent) {
        // eslint-disable-next-line no-console
        console.warn('Can not find component for element: ', element.tag);
        return null;
      }

      renderedElement = (
        <ElementComponent
          element={element}
          style={elementStyle}
          renderElement={this.renderElement}
        />
      );
    }

    return renderedElement;
  }

  render() {
    const { style, body } = this.props;
    const { htmlTree } = this.state;

    if (!body) {
      return null;
    }

    if (!htmlTree) {
      // Either still processing the Html or
      // waiting for layout animations to complete
      return (
        <View styleName="md-gutter">
          <Spinner styleName="sm-gutter" />
        </View>
      );
    }

    const htmlRootElement = htmlTree.getRootNode();

    return (
      <View style={style.container}>{this.renderElement(htmlRootElement)}</View>
    );
  }
}

export const ElementPropTypes = {
  childElements: PropTypes.array,
  renderElement: PropTypes.func,
  inlineStyle: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default connectStyle('shoutem.ui.Html')(Html);

/* Helpers */

/**
 * @param element {Element}
 * @returns {boolean}
 */
export const isBlockElement = function(element) {
  // eslint-disable-next-line no-use-before-define
  return getElementDisplay(element, 'display') === Display.BLOCK;
};

/**
 * @param elements {Array}
 * @returns {boolean}
 */
export const hasBlockElement = function(elements) {
  return _.some(elements, isBlockElement);
};

/**
 * Use to create an enhanced component that mapS
 * element (description) to the wrapped component props.
 * Element is default property that Html renderElement provides to the components.
 * @param mapFunctions {Array}
 *  List of functions that map element description to the component props.
 * @returns {function({element, renderElement}): Component}
 *  Returns HOC that will map component props with provided map functions.
 */
export const combineMappers = function(...mapFunctions) {
  return WrappedComponent => props => {
    // eslint-disable-next-line prefer-arrow-callback
    const customizedProps = _.reduce(
      mapFunctions,
      function(result, mapFunction) {
        return {
          ...result,
          ...mapFunction(props),
        };
      },
      { ...props },
    );

    return <WrappedComponent {...customizedProps} />;
  };
};

/**
 * Destruct an element description to the component props format.
 * @param props {{ element, renderElement }}
 * @returns {Object}
 */
export const mapElementProps = function({ element, style }) {
  const { childElements, attributes, tag } = element;
  return {
    ...attributes,
    style,
    childElements,
    htmlInlineStyle: attributes.style,
    elementTag: tag,
  };
};

/**
 * @param childElements {Array}
 * @param renderElement {Function}
 * @returns {Children}
 */
export const renderChildElements = function(childElements, renderElement) {
  return React.Children.toArray(childElements.map(renderElement));
};

/**
 * Render and map elements to the children prop.
 * @param element {Element}
 * @param renderElement {Function}
 * @returns {Object} Props with children prop
 */
export const renderChildren = function({ element, renderElement }) {
  const { childElements } = element;
  return {
    children: renderChildElements(childElements, renderElement),
  };
};

/**
 * Extend the original renderElement with a customizer.
 * If the customizer doesn't render a element, renderElement will be used.
 * It can be used to customize renderElement from certain element node.
 * @param customizer {Function}
 * @param renderElement {Function}
 * @returns {Component}
 */
export const customizeRenderElement = function(customizer, renderElement) {
  return function(element) {
    const renderedElement = customizer(element);
    if (renderedElement) {
      return renderedElement;
    }

    return renderElement(element);
  };
};
