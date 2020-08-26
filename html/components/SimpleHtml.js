import React, { PureComponent } from 'react';
import { Dimensions, Linking } from 'react-native';
import PropTypes from 'prop-types';
import autoBind from 'auto-bind/react';
import _ from 'lodash';
import HTML from 'react-native-render-html';

import { cssStringToObject, cssObjectToString } from 'react-native-render-html/src/HTMLStyles';

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

  static defaultProps = {
    body: undefined,
    style: {},
    customTagStyles: undefined,
    customHandleLinkPress: undefined,
  };

  constructor(props) {
    super(props);

    autoBind(this);
  }

  onLinkPress(evt, href) {
    const { customHandleLinkPress } = this.props;

    return customHandleLinkPress ? customHandleLinkPress(href) : Linking.openURL(href);
  }

  /* eslint-disable no-param-reassign */
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

    const paddingValue = style.container.paddingLeft * 2;
    const maxWidth = Dimensions.get('window').width - paddingValue;
    const nodeHeight = _.get(node, 'attribus.height');
    const nodeRatio = nodeWidth / nodeHeight;
    const resolvedWidth = (nodeWidth > maxWidth) ? maxWidth : nodeWidth;
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
  /* eslint-enable no-param-reassign */

  /* eslint-disable no-unused-vars */
  renderUnorderedListPrefix(htmlAttribs, children, convertedCSSStyles, passProps) {
    const { style } = this.props;

    return (
      <Text style={style.prefix}>•  </Text>
    );
  }

  renderOrderedListPrefix(htmlAttribs, children, convertedCSSStyles, passProps) {
    const { style } = this.props;

    const resultingPrefix = `${passProps.index + 1}. `;

    return <Text style={style.prefix}>{resultingPrefix}</Text>;
  }
  /* eslint-enable no-unused-vars */

  render() {
    const {
      style,
      body,
      customTagStyles,
      ...otherProps
    } = this.props;

    const paddingValue = style.container.paddingLeft * 2;
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
      listsPrefixesRenderers: listPrefixRenderers,
    };

    return (
      <View style={style.container}>
        <HTML {...htmlProps} {...otherProps} />
      </View>
    );
  }
}

export default connectStyle('shoutem.ui.SimpleHtml')(SimpleHtml);
