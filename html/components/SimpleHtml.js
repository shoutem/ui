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
import { connectStyle } from '@shoutem/theme';
import { View } from '../../components/View';
import { Text } from '../../components/Text';
import getEmptyObjectKeys from '../services/getEmptyObjectKeys';

class SimpleHtml extends PureComponent {
  static propTypes = {
    body: PropTypes.string,
    style: PropTypes.object,
    customTagStyles: PropTypes.object,
    customHandleLinkPress: PropTypes.func,
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
   */
  alterNode(node) {
    const { style } = this.props;

    const styleAttrib = _.get(node, 'attribs.style', '').trim();
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

      if (lastBrNode.next === null) {
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

  render() {
    const { style, body, customTagStyles, ...otherProps } = this.props;

    const paddingValue = _.get(style, 'container.paddingLeft') * 2;
    const maxWidth = Dimensions.get('window').width - paddingValue;

    const tagStyles = {
      ...style.tags,
      ...customTagStyles,
    };

    const listPrefixRenderers = {
      ul: this.renderUnorderedListPrefix,
      ol: this.renderOrderedListPrefix,
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
    };

    return (
      <View style={style.container}>
        <Html {...htmlProps} {...otherProps} />
      </View>
    );
  }
}

export default connectStyle('shoutem.ui.SimpleHtml')(SimpleHtml);
