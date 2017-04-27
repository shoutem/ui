import React, { Component } from 'react';
import _ from 'lodash';

import { View } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import { parseHtml } from './services/HtmlParser';
import {
  registerElement,
  getElement,
  getElementDisplay,
  getElementProperty,
  Display,
} from './services/ElementRegistry';

const defaultElementSettings = {
  display: Display.BLOCK,
};

class Html extends Component {
  static propTypes = {
    body: React.PropTypes.string.isRequired,
    renderElement: React.PropTypes.func,
    style: React.PropTypes.object,
  };

  /**
   * Create Element class for given element name and add it to the ElementClassMap.
   * Use the settings to additionally describe a Element class.
   * @param elementTag {string} HTML element name
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

  constructor(props, context) {
    super(props, context);
    this.renderElement = this.renderElement.bind(this);
  }

  /**
   * Render HTML element as React Native component.
   * This method is passed to both custom renderElement and
   * element corresponding component. It is also used to render children
   * and should be passed down the tree so that children can be rendered.
   * @param element {Element} Parsed HTML element
   * @returns {Component} The element rendered as a React Native component
   */
  renderElement(element) {
    let renderedElement;

    if (this.props.renderElement) {
      renderedElement = this.props.renderElement(element, this.renderElement);
    }

    // Custom renderElement for the specific Html implementation
    // has advantage over the "global". If custom renderElement rendered
    // a component that component will be used, otherwise fallback to "global".
    if (!renderedElement) {
      const ElementComponent = getElementProperty(element, 'component');

      if (!ElementComponent) {
        console.log('Can not find component for element: ', element.tag);
        return null;
      }

      renderedElement = <ElementComponent element={element} renderElement={this.renderElement} />;
    }

    return renderedElement;
  }

  render() {
    const { body, style } = this.props;

    const htmlTree = parseHtml(body);
    const htmlRootElement = htmlTree.getRootNode();

    return (
      <View style={style.container}>
        {this.renderElement(htmlRootElement)}
      </View>
    );
  }
}

export const ElementPropTypes = {
  childElements: React.PropTypes.array,
  renderElement: React.PropTypes.func,
  inlineStyle: React.PropTypes.string,
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node,
  ]),
};

export default connectStyle('shoutem.ui.Html')(Html);


/* Helpers */

export const connectElementStyle = function (elementTag) {
  return Component => connectStyle(`shoutem.ui.Html.${elementTag}`)(Component);
};

export const isBlockElement = function (element) {
  // eslint-disable-next-line no-use-before-define
  return getElementDisplay(element, 'display') === Display.BLOCK;
};

export const hasBlockElement = function (elements) {
  return _.some(elements, isBlockElement);
};

/**
 * Map wrapped component props.
 * @param mapFunctions {Array}
 *  List of functions that destruct element description as the component props.
 * @returns {function({element, renderElement}): Component}
 *  Returns HOC that will map component props with provided map functions.
 */
export const mapComponentProps = function (...mapFunctions) {
  return WrappedComponent => props => {
    // eslint-disable-next-line prefer-arrow-callback
    const customizedProps = _.reduce(mapFunctions, function (result, mapFunction) {
      return {
        ...result,
        ...mapFunction(props),
      };
    }, { ...props });

    return <WrappedComponent {...customizedProps} />;
  };
};

/**
 * Destruct an element description to the component props format.
 * @param props {{ element, renderElement }}
 * @returns {Object}
 */
export const mapElementProps = function ({ element, style }) {
  const { childElements, attributes, tag } = element;
  return {
    ...attributes,
    style, // Do not map style
    childElements,
    htmlInlineStyle: attributes.style,
    elementTag: tag,
  };
};

export const renderChildElements = function (childElements, renderElement) {
  return React.Children.toArray(childElements.map(renderElement));
};

export const renderChildren = function ({ element, renderElement }) {
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
export const customizeRenderElement = function (customizer, renderElement) {
  return function (element) {
    const renderedElement = customizer(element);
    if (renderedElement) {
      return renderedElement;
    }

    return renderElement(element);
  };
};
