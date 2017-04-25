import React, { Component } from 'react';
import { parseHtml } from '../services/HtmlParser';
import {
  addElementClass,
  getElementDisplay,
  getElementClassAttribute,
} from '../services/ElementClassMap';
import { View } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import _ from 'lodash';

export const Display = {
  INLINE: 1,
  BLOCK: 2,
};

const defaultElementSettings = {
  display: Display.BLOCK,
};

class RichMedia extends Component {
  static propTypes = {
    html: React.PropTypes.string.isRequired,
    renderElement: React.PropTypes.func,
    style: React.PropTypes.object,
  };

  /**
   * Create Element class for given element name and add it to the ElementClassMap.
   * Use the settings to additionally describe a Element class.
   * @param elementTag {string} HTML element name
   * @param component {Component} React Native Component
   * @param settings {{ display }}} Default settings override
   *   Most times a developer will only want to override one setting,
   *   that's why settings are merged with defaultElementSettings.
   *   Use mapProps to transform parsed attributes passed to the component.
   *   Use display to describe component display. Can be a function to dynamically resolve display.
   */
  static registerElement(elementTag, component, settings = {}) {
    const elementSettings = _.assign({}, defaultElementSettings, settings);

    addElementClass(elementTag, { ...elementSettings, component });
  }

  constructor(props, context) {
    super(props, context);
    this.renderElement = this.renderElement.bind(this);
  }

  /**
   * @param element {Element} Html parsed element
   * @returns {Component} To render
   */
  renderElement(element) {
    let renderedElement;

    if (this.props.renderElement) {
      renderedElement = this.props.renderElement(element, this.renderElement);
    }

    if (!renderedElement) {
      const ElementComponent = getElementClassAttribute(element, 'component');

      if (!ElementComponent) {
        console.log('Can not find component for element: ', element.tag);
        return null;
      }

      renderedElement = <ElementComponent element={element} renderElement={this.renderElement} />;
    }

    return renderedElement;
  }

  render() {
    const { html, style } = this.props;

    const htmlTree = parseHtml(html);
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

export default connectStyle('shoutem.ui.RichMedia')(RichMedia);


/* Helpers */

export const richMediaConnectStyle = function (elementTag) {
  return Component => connectStyle(`shoutem.ui.RichMedia.${elementTag}`)(Component);
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
 * @returns {function({element, renderElement}): Component}
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
 *
 * @param props {{ element, renderElement }}
 * @returns {{children: *}}
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

export const customizeRenderElement = function (customizer, renderElement) {
  return function (element) {
    const renderedElement = customizer(element);
    if (renderedElement) {
      return renderedElement;
    }

    return renderElement(element);
  };
};
