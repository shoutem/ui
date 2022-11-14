import React, { PureComponent } from 'react';
import { Dimensions, Linking } from 'react-native';
import Html from 'react-native-render-html';
import {
  alterNode as tableAlterNode,
  cssRulesFromSpecs,
  defaultTableStylesSpecs,
  IGNORED_TAGS,
  makeTableRenderer,
} from 'react-native-render-html-table-bridge';
import WebView from 'react-native-webview';
import IframeRenderer, { iframeModel } from '@native-html/iframe-plugin';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text } from '../../components/Text';
import { View } from '../../components/View';
import getEmptyObjectKeys from '../services/getEmptyObjectKeys';
import { cssObjectToString, cssStringToObject } from '../services/HtmlParser';
import isValidVideoFormat from '../services/isValidVideoFormat';
import Image from './Image';

function resolveMaxWidth(style) {
  // parentContainerPadding - padding between screen & SimpleHtml. Parent container
  // can have it's own padding. If it does, we have to include it in calculation,
  // otherwise maxWidth will be more than max & images will go over the edge
  const parentContainerPadding = style.outerPadding || 0;
  const paddingValue =
    style.container.paddingLeft ||
    0 + style.container.paddingRight ||
    0 + parentContainerPadding;

  return Dimensions.get('window').width - paddingValue;
}

function resolveDimensions(objectToResize, style) {
  const { width, height } = objectToResize;

  if (!width || !height) {
    return { width, height };
  }

  const maxWidth = resolveMaxWidth(style);
  const objectToResizeRatio = height / width;
  const resolvedWidth = width > maxWidth ? maxWidth : width;
  const resolvedHeight = Math.round(resolvedWidth * objectToResizeRatio);

  return { width: resolvedWidth, height: resolvedHeight };
}

class SimpleHtml extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  onLinkPress(evt, href) {
    const { customHandleLinkPress } = this.props;

    return customHandleLinkPress
      ? customHandleLinkPress(href)
      : Linking.openURL(href);
  }

  /**
   * Removes empty (therefore invalid) style attribute properties
   * Scales down objects with specified width and height if too large
   * Removes padding and height from suneditor for 'figure' tag that it nests
   * video iframe tags in when video format is unsupported
   */
  alterNode(node) {
    const { customAlterNode, style } = this.props;

    const styleAttrib = _.get(node, 'attribs.style', '').trim();

    if (customAlterNode && _.isFunction(customAlterNode)) {
      const resolvedNode = customAlterNode(
        node,
        cssObjectToString,
        cssStringToObject,
      );

      if (resolvedNode) {
        return resolvedNode;
      }
    }

    if (node.name === 'table') {
      return tableAlterNode(node);
    }

    if (node.name === 'figure') {
      const firstChild = _.head(node.children);

      if (firstChild.name === 'iframe') {
        const nodeStyle = cssStringToObject(styleAttrib);
        const source = _.get(firstChild, 'attribs.src', '');

        const resolvedNodeStyle = isValidVideoFormat(source)
          ? _.omit(nodeStyle, ['height', 'padding-bottom'])
          : nodeStyle;

        node.attribs.style = cssObjectToString(resolvedNodeStyle);

        return node;
      }
    }

    const nodeWidth = node.attribs?.width;

    if (!styleAttrib && !nodeWidth) {
      return false;
    }

    const nodeHeight = node.attribus?.height;
    const nodeDimensions = { width: nodeWidth, height: nodeHeight };
    const { width, height } = resolveDimensions(nodeDimensions, style);

    const nodeStyle = cssStringToObject(styleAttrib);
    const invalidKeys = getEmptyObjectKeys(nodeStyle);

    if (invalidKeys.length || nodeWidth) {
      const styleFiltered = _.omit(style, invalidKeys);
      node.attribs.style = cssObjectToString(styleFiltered);
      node.attribs.width = width;
      node.attribs.height = height;

      return node;
    }

    return false;
  }

  /**
   * Removes child break node in case when it's positioned at the end
   * of parent div node and div has content in it.
   * Example:
   * <div>first line<br></div>
   * <div>second line<br></div>
   *
   * If br is left as is, <Html> will show empty line under div, not just
   * break into new line
   */
  alterChildren(node) {
    const { children, name } = node;

    if ((name === 'div' || name === 'p') && children && children.length > 1) {
      const brNodes = _.filter(children, { name: 'br' });
      const lastBrNode = _.last(brNodes);

      if (lastBrNode && lastBrNode.next === null) {
        const lastBrNodeIndex = _.indexOf(children, lastBrNode);
        return children.splice(0, lastBrNodeIndex);
      }
    }

    return children;
  }

  renderUnorderedListPrefix() {
    const { style } = this.props;

    return <Text style={style.prefix}>• </Text>;
  }

  renderOrderedListPrefix(
    htmlAttribs,
    children,
    convertedCSSStyles,
    passProps,
  ) {
    const { style } = this.props;

    return <Text style={style.prefix}>{passProps.index + 1}. </Text>;
  }

  /**
   * Custom rendered method for handling <attachment> tags
   * Currently only supports rendering image attachments.
   */
  renderAttachments({ id, type }) {
    const { attachments, style } = this.props;

    if (!attachments) {
      return null;
    }

    if (type === 'image') {
      const image = _.find(attachments, { id });

      if (image && image.src) {
        const source = { uri: image.src };
        const imageSize = { width: image.width, height: image.height };
        const { height, width } = resolveDimensions(imageSize, style);
        const resolvedStyle = { alignSelf: 'center', height, width };

        return <Image source={source} key={id} style={resolvedStyle} />;
      }
    }

    return null;
  }

  render() {
    const { style, body, customTagStyles, ...otherProps } = this.props;

    const maxWidth = resolveMaxWidth(style);

    const tagStyles = {
      ...style.tags,
      ...customTagStyles,
    };

    const listPrefixRenderers = {
      ul: this.renderUnorderedListPrefix,
      ol: this.renderOrderedListPrefix,
    };

    const tableStyle = _.get(style, 'table', {});
    const tableCssStyle = _.get(style, 'tableCss', '');
    const cssStyle = cssRulesFromSpecs({
      ...defaultTableStylesSpecs,
      ...tableStyle,
    });
    const cssRules = `${cssStyle}${tableCssStyle}`;

    const customRenderers = {
      iframe: IframeRenderer,
      table: makeTableRenderer({ WebViewComponent: WebView, cssRules }),
      attachment: this.renderAttachments,
    };

    const customHTMLElementModels = {
      iframe: iframeModel,
    };

    const htmlProps = {
      customHTMLElementModels,
      html: body,
      imagesMaxWidth: maxWidth,
      staticContentMaxWidth: maxWidth,
      tagsStyles: tagStyles,
      baseFontStyle: style.baseFont,
      ignoredStyles: ['font-family', 'letter-spacing', 'transform'],
      onLinkPress: this.onLinkPress,
      alterNode: this.alterNode,
      alterChildren: this.alterChildren,
      listsPrefixesRenderers: listPrefixRenderers,
      renderers: customRenderers,
      ignoredTags: IGNORED_TAGS,
    };

    return (
      <View style={style.container}>
        <Html {...htmlProps} {...otherProps} />
      </View>
    );
  }
}

SimpleHtml.propTypes = {
  style: PropTypes.object.isRequired,
  attachments: PropTypes.array,
  body: PropTypes.string,
  customAlterNode: PropTypes.func,
  customHandleLinkPress: PropTypes.func,
  customTagStyles: PropTypes.object,
  unsupportedVideoFormatMessage: PropTypes.string,
};

SimpleHtml.defaultProps = {
  attachments: undefined,
  body: undefined,
  customAlterNode: undefined,
  customHandleLinkPress: undefined,
  customTagStyles: undefined,
  unsupportedVideoFormatMessage: undefined,
};

export default connectStyle('shoutem.ui.SimpleHtml')(SimpleHtml);
