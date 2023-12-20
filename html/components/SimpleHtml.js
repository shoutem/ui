import React, { PureComponent } from 'react';
import { Linking } from 'react-native';
import Html, {
  defaultSystemFonts,
  HTMLContentModel,
  HTMLElementModel,
} from 'react-native-render-html';
import WebView from 'react-native-webview';
import { iframeModel } from '@native-html/iframe-plugin';
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
import VideoRenderer from '@shoutem/ui/html/components/VideoRenderer';
import { View } from '../../components/View';
import { resolveMaxWidth } from '../services/Dimensions';
import { onElement } from '../services/DomVisitors';
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

  render() {
    const {
      style,
      body,
      customTagStyles,
      unsupportedVideoFormatMessage,
      attachments,
      domVisitors,
      ...otherProps
    } = this.props;

    const maxWidth = resolveMaxWidth(style);

    const tagStyles = {
      ...style.tags,
      ...customTagStyles,
    };

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
      video: VideoRenderer,
    };

    const htmlProps = {
      source: { html: body },
      computeEmbeddedMaxWidth: () => maxWidth,
      contentWidth: maxWidth,
      tagsStyles: _.omitBy(tagStyles, tagStyle => !tagStyle),
      systemFonts: [...defaultSystemFonts, style.baseFont.fontFamily],
      baseStyle: style.baseFont,
      ignoredStyles: ['fontFamily', 'letterSpacing', 'transform'],
      renderers: customRenderers,
      renderersProps: {
        table: {
          cssRules,
        },
        a: { onPress: this.onLinkPress },
        iframe: {
          webViewProps: {
            renderToHardwareTextureAndroid: true,
          },
        },
        video: (htmlAttribs, _children, _convertedCSSStyles, passProps) => {
          return (
            <View
              key={passProps.key}
              style={{
                width: '100%',
                aspectRatio: 16.0 / 9.0,
                marginTop: 16,
                marginBottom: 16,
              }}
            >
              <WebView
                scrollEnabled={false}
                source={{ uri: htmlAttribs.src }}
                style={{ flex: 1, width: '100%', aspectRatio: 16.0 / 9.0 }}
              />
            </View>
          );
        },
      },
      customHTMLElementModels: {
        table: tableModel,
        iframe: iframeModel,
        video: HTMLElementModel.fromCustomModel({
          contentModel: HTMLContentModel.block,
          tagName: 'video',
          isOpaque: true,
        }),
      },
      WebView,
      ignoredTags: IGNORED_TAGS,
      domVisitors: { onElement },
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
  domVisitors: PropTypes.object,
  unsupportedVideoFormatMessage: PropTypes.string,
};

SimpleHtml.defaultProps = {
  attachments: undefined,
  body: undefined,
  customAlterNode: undefined,
  customHandleLinkPress: undefined,
  customTagStyles: undefined,
  unsupportedVideoFormatMessage: undefined,
  domVisitors: { onElement },
};

export default connectStyle('shoutem.ui.SimpleHtml')(SimpleHtml);
