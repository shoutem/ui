import { Dimensions, Linking } from 'react-native';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Html from 'react-native-render-html';
import {
  cssStringToObject,
  cssObjectToString,
} from 'react-native-render-html/src/HTMLStyles';
import WebView from 'react-native-webview';
import {
  makeTableRenderer,
  alterNode as tableAlterNode,
  cssRulesFromSpecs,
  defaultTableStylesSpecs,
  IGNORED_TAGS,
} from 'react-native-render-html-table-bridge';
import { iframe } from 'react-native-render-html/src/HTMLRenderers';
import YoutubePlayer from 'react-native-youtube-iframe';
import { connectStyle } from '@shoutem/theme';
import { View } from '../../components/View';
import { Text } from '../../components/Text';
import getEmptyObjectKeys from '../services/getEmptyObjectKeys';
import isValidVideoFormat from '../services/isValidVideoFormat';
import Image from './Image';

class SimpleHtml extends PureComponent {
  static propTypes = {
    body: PropTypes.string,
    attachments: PropTypes.array,
    style: PropTypes.object,
    customTagStyles: PropTypes.object,
    customHandleLinkPress: PropTypes.func,
    unsupportedVideoFormatMessage: PropTypes.string,
    customAlterNode: PropTypes.func,
  };

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
      return customAlterNode(node, cssObjectToString, cssStringToObject);
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

    const nodeWidth = _.get(node, 'attribs.width', false);

    if (!styleAttrib && !nodeWidth) {
      return false;
    }

    const paddingValue = _.get(style, 'container.paddingLeft') * 2;
    const maxWidth = Dimensions.get('window').width - paddingValue;
    const nodeHeight = _.get(node, 'attribus.height');
    const nodeRatio = nodeWidth / nodeHeight;
    const resolvedWidth = nodeWidth > maxWidth ? maxWidth : nodeWidth;
    const resolvedHeight = Math.round(resolvedWidth * nodeRatio);

    const nodeStyle = cssStringToObject(styleAttrib);
    const invalidKeys = getEmptyObjectKeys(nodeStyle);

    if (invalidKeys.length || nodeWidth) {
      const styleFiltered = _.omit(style, invalidKeys);
      node.attribs.style = cssObjectToString(styleFiltered);
      node.attribs.width = resolvedWidth;
      node.attribs.height = resolvedHeight;

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
    const { attachments } = this.props;

    if (!attachments) {
      return null;
    }

    if (type === 'image') {
      const image = _.find(attachments, { id });

      if (image && image.src) {
        const source = { uri: image.src };
        const style = { height: image.height, alignSelf: 'center' };

        return <Image source={source} key={id} style={style} />;
      }
    }

    return null;
  }

  renderIframe(htmlAttribs, children, convertedCSSStyles, passProps) {
    const { style } = this.props;

    const url = htmlAttribs?.src;

    if (url && !isValidVideoFormat(url)) {
      const { unsupportedVideoFormatMessage } = this.props;

      const message =
        unsupportedVideoFormatMessage || 'Unsupported video format.';

      return (
        <View
          style={style.fallback}
          styleName="vertical h-center v-center"
          key={passProps.key}
        >
          <Text>{message}</Text>
        </View>
      );
    }

    if (url && (url.includes('youtube') || url.includes('youtu.be'))) {
      const youtubeIdRegEx = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const regExMatch = url.match(youtubeIdRegEx);
      const youtubeId =
        regExMatch && regExMatch[7].length === 11 ? regExMatch[7] : false;

      return (
        <YoutubePlayer
          height={style.video.height}
          key={passProps.key}
          videoId={youtubeId}
        />
      );
    }

    return iframe(htmlAttribs, children, convertedCSSStyles, passProps);
  }

  render() {
    const { style, body, customTagStyles, ...otherProps } = this.props;

    // parentContainerPadding - padding between screen & SimpleHtml. Parent container
    // can have it's own padding. If it does, we have to include it in calculation,
    // otherwise maxWidth will be more than max & images will go over the edge
    const parentContainerPadding = style.outerPadding || 0;
    const paddingValue =
      _.get(style, 'container.paddingLeft') * 2 + parentContainerPadding;
    const maxWidth = Dimensions.get('window').width - paddingValue;

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
      iframe: this.renderIframe,
      table: makeTableRenderer({ WebViewComponent: WebView, cssRules }),
      attachment: this.renderAttachments,
    };

    const htmlProps = {
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

export default connectStyle('shoutem.ui.SimpleHtml')(SimpleHtml);
