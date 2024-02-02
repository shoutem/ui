import React, { PureComponent } from 'react';
import { Linking } from 'react-native';
import Html, { defaultSystemFonts } from 'react-native-render-html';
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
import { videoModel } from '@shoutem/ui/html/services/HTMLElementModels';
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
      unsupportedVideoFormatMessage,
      attachments,
      customDomVisitors,
      customCustomRenderers,
      customTagStyles,
      customHtmlElementModels,
      customIgnoredStyles,
      customRendererProps,
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
      div: ({ TDefaultRenderer, ...props }) => {
        const resolvedStyle =
          props.tnode?.attributes?.class !== 'image-inline'
            ? {}
            : { flex: 1, flexDirection: 'row', alignItems: 'center' };

        return <TDefaultRenderer {...props} style={resolvedStyle} />;
      },
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
      ...customCustomRenderers,
    };

    const htmlProps = {
      source: { html: body },
      computeEmbeddedMaxWidth: () => maxWidth,
      contentWidth: maxWidth,
      tagsStyles: _.omitBy(tagStyles, tagStyle => !tagStyle),
      systemFonts: [...defaultSystemFonts, style.baseFont.fontFamily],
      baseStyle: style.baseFont,
      ignoredStyles: [
        'fontFamily',
        'letterSpacing',
        'transform',
        ...customIgnoredStyles,
      ],
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
        ...customRendererProps,
      },
      customHTMLElementModels: {
        table: tableModel,
        iframe: iframeModel,
        video: videoModel,
        ...customHtmlElementModels,
      },
      WebView,
      ignoredTags: IGNORED_TAGS,
      domVisitors: { onElement, ...customDomVisitors },
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
  customCustomRenderers: PropTypes.object,
  customDomVisitors: PropTypes.object,
  customHandleLinkPress: PropTypes.func,
  customHtmlElementModels: PropTypes.object,
  customIgnoredStyles: PropTypes.arrayOf(PropTypes.string),
  customRendererProps: PropTypes.object,
  customTagStyles: PropTypes.object,
  domVisitors: PropTypes.object,
  unsupportedVideoFormatMessage: PropTypes.string,
};

SimpleHtml.defaultProps = {
  attachments: undefined,
  body: undefined,
  customHandleLinkPress: undefined,
  customTagStyles: {},
  unsupportedVideoFormatMessage: undefined,
  domVisitors: { onElement },
  customDomVisitors: {},
  customCustomRenderers: {},
  customHtmlElementModels: {},
  customIgnoredStyles: [],
  customRendererProps: {},
};

export default connectStyle('shoutem.ui.SimpleHtml')(SimpleHtml);
