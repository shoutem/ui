import React, { PureComponent } from 'react';
import { Linking } from 'react-native';
import Html, { defaultSystemFonts } from 'react-native-render-html';
import {
  cssObjectToString,
  cssStringToObject,
} from 'react-native-render-html/src/HTMLStyles';
import WebView from 'react-native-webview';
import table, {
  cssRulesFromSpecs,
  defaultTableStylesSpecs,
  IGNORED_TAGS,
  tableModel,
} from '@native-html/table-plugin';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
// import { Text } from '../../components/Text';
import { View } from '../../components/View';
import { resolveDimensions, resolveMaxWidth } from '../services/Dimensions';
import getEmptyObjectKeys from '../services/getEmptyObjectKeys';
import isValidVideoFormat from '../services/isValidVideoFormat';
import AttachmentRenderer from './AttachmentRenderer';
import IframeRenderer from './IframeRenderer';

class SimpleHtml extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  onLinkPress(_evt, href) {
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

  // renderUnorderedListPrefix() {
  //   const { style } = this.props;

  //   return <Text style={style.prefix}>• </Text>;
  // }

  // renderOrderedListPrefix(
  //   htmlAttribs,
  //   children,
  //   convertedCSSStyles,
  //   passProps,
  // ) {
  //   const { style } = this.props;

  //   return <Text style={style.prefix}>{passProps.index + 1}. </Text>;
  // }

  render() {
    const {
      style,
      body,
      customTagStyles,
      unsupportedVideoFormatMessage,
      attachments,
      ...otherProps
    } = this.props;

    const maxWidth = resolveMaxWidth(style);

    const tagStyles = {
      ...style.tags,
      ...customTagStyles,
    };

    // const listPrefixRenderers = {
    //   ul: this.renderUnorderedListPrefix,
    //   ol: this.renderOrderedListPrefix,
    // };

    const tableStyle = _.get(style, 'table', {});
    const tableCssStyle = _.get(style, 'tableCss', '');
    const cssStyle = cssRulesFromSpecs({
      ...defaultTableStylesSpecs,
      ...tableStyle,
    });
    const cssRules = `${cssStyle}${tableCssStyle}`;

    const customRenderers = {
      iframe: props => (
        <IframeRenderer
          {...props}
          shoutemStyle={style}
          unsupportedVideoFormatMessage={unsupportedVideoFormatMessage}
        />
      ),
      table,
      attachment: props => (
        <AttachmentRenderer
          {...props}
          attachments={attachments}
          style={style}
        />
      ),
    };

    const htmlProps = {
      html: body,
      computeEmbeddedMaxWidth: () => maxWidth,
      contentWidth: maxWidth,
      tagsStyles: tagStyles,
      systemFonts: [...defaultSystemFonts, style.baseFont.fontFamily],
      baseStyle: style.baseFont,
      ignoredStyles: ['font-family', 'letter-spacing', 'transform'],
      // alterNode: this.alterNode,
      // listsPrefixesRenderers: listPrefixRenderers,
      // customListStyleSpecs:
      renderers: customRenderers,
      renderersProps: {
        table: {
          cssRules,
        },
        a: { onPress: this.onLinkPress },
      },
      customHTMLElementModels: {
        table: tableModel,
      },
      WebView,
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
