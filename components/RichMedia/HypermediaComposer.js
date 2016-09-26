import React, {
  Component,
  PropTypes,
} from 'react';

import { Text } from '../Text';
import { View } from '../View';
import { AllHtmlEntities } from 'html-entities';

import transformImageTag from './transformImageTag';
import transformVideoTag from './transformVideoTag';
import transformHtmlTag from './transformHtmlTag';
import transformAnchorTag from './transformAnchorTag';

const TEXT_NODE = 'text';
const ELEMENT_NODE = 'tag';

const defaultElementTransformers = [
  transformImageTag,
  transformVideoTag,
];

const defaultHtmlTextTransformers = [
  transformHtmlTag,
];

function decodeHTML(string) {
  return AllHtmlEntities.decode(string);
}

/**
 * Composes react components by using transformer functions.
 * It uses transformers for HTML tags but can also
 * use other tags if their tag transformers are provided
 * as the constructor arguments.
 */
export default class HypermediaComposer extends Component {

  constructor(props) {
    super(props);
    const {
      elementTransformer,
      textTransformer,
      style,
      openUrl,
    } = props;

    this.containsElement = this.containsElement.bind(this);

    const anchorTagTransformer = transformAnchorTag(this.containsElement, openUrl);
    defaultHtmlTextTransformers.push(anchorTagTransformer);

    if (elementTransformer) {
      // custom element transformer takes precedence over all other transformers
      this.elementTransformers = [elementTransformer, ...defaultElementTransformers];
    } else {
      this.elementTransformers = defaultElementTransformers;
    }

    if (textTransformer) {
      // custom text transformer takes precedence over all other transformers
      this.textTransformers = [textTransformer, ...defaultHtmlTextTransformers];
    } else {
      this.textTransformers = defaultHtmlTextTransformers;
    }

    this.transformers = [...this.elementTransformers, ...this.textTransformers];
    this.renderElementNode = this.renderElementNode.bind(this);
    this.style = style;
  }

  isElementNode(node) {
    const { style } = this.props;
    return this.elementTransformers.some(transformer => transformer(node, style, () => {}));
  }

  containsElement(node) {
    return this.isElementNode(node)
    || (!!node.children && node.children.some((childNode) => this.containsElement(childNode)));
  }

  /**
   * Return an array of react components representing the provided
   * array of dom nodes.
   *
   * @param dom array of nodes to be transformed.
   * @param parent parent node.
   * @returns [ReactComponents] an array of React components.
   */
  domToElement(dom, parent) {
    if (!dom) return null;

    const styles = this.style;

    return dom.map((node, index) => {
      if (node.type === TEXT_NODE) {
        const parentStyle = parent ? styles[parent.name] : null;
        return (
          <Text key={index} style={parentStyle}>
            {decodeHTML(node.data)}
          </Text>
        );
      }

      if (node.type === ELEMENT_NODE) {
        return this.renderElementNode(node, index);
      }

      return null;
    });
  }

  renderElementNode(node, index) {
    const ContainerElement = this.containsElement(node) ? View : Text;
    const renderChildren = this.domToElement.bind(this, node.children, node);

    // check if there is a transformer which is able to render a truthy value
    // and if there is, save it as a transformedTag
    const transformedTag = this.transformers.reduce((acc, transform) => {
      const transformedContent = transform(node, this.style, renderChildren);

      if (transformedContent) {
        return transformedContent;
      }

      return acc;
    }, null);

    if (transformedTag) {
      return (
        <ContainerElement key={index} >
          {transformedTag}
        </ContainerElement>
      );
    }

    return this.domToElement(node.children, node);
  }

  render() {
    const { dom } = this.props;
    const content = this.domToElement(dom);

    return (
      <View style={this.props.style.container}>
        {content}
      </View>
    );
  }
}

HypermediaComposer.propTypes = {
  dom: PropTypes.arrayOf(PropTypes.object),
  onError: PropTypes.func,
  style: PropTypes.shape({
    container: PropTypes.object,
  }),
  openUrl: PropTypes.func,
  elementTransformer: PropTypes.func,
  textTransformer: PropTypes.func,
};
