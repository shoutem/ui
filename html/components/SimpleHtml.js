import React, { useCallback, useMemo } from 'react';
import { Linking } from 'react-native';
import Html, { defaultSystemFonts } from 'react-native-render-html';
import WebView from 'react-native-webview';
import { iframeModel } from '@native-html/iframe-plugin';
import table, {
  cssRulesFromSpecs,
  defaultTableStylesSpecs,
  tableModel,
} from '@native-html/table-plugin';
import _ from 'lodash';
import { connectStyle } from '@shoutem/theme';
import VideoRenderer from '@shoutem/ui/html/components/VideoRenderer';
import { videoModel } from '@shoutem/ui/html/services/HTMLElementModels';
import { View } from '../../components/View';
import { resolveMaxWidth } from '../services/Dimensions';
import { onElement } from '../services/DomVisitors';
import AttachmentRenderer from './AttachmentRenderer';
import IframeRenderer from './IframeRenderer';

const SimpleHtml = ({
  style,
  body,
  unsupportedVideoFormatMessage,
  attachments,
  customDomVisitors = {},
  customCustomRenderers = {},
  customTagStyles = {},
  customHtmlElementModels = {},
  customIgnoredStyles = [],
  customRendererProps = {},
  customHandleLinkPress,
  ...otherProps
}) => {
  const onLinkPress = useCallback(
    (_evt, href) => {
      return customHandleLinkPress
        ? customHandleLinkPress(href)
        : Linking.openURL(href);
    },
    [customHandleLinkPress],
  );

  const maxWidth = useMemo(() => {
    return resolveMaxWidth(style);
  }, [style]);

  const tagStyles = useMemo(
    () => ({
      ...style.tags,
      ...customTagStyles,
    }),
    [style.tags, customTagStyles],
  );

  const cssRules = useMemo(() => {
    const tableStyle = _.get(style, 'table', {});
    const tableCssStyle = _.get(style, 'tableCss', '');
    const cssStyle = cssRulesFromSpecs({
      ...defaultTableStylesSpecs,
      ...tableStyle,
    });
    return `${cssStyle}${tableCssStyle}`;
  }, [style]);

  const customRenderers = useMemo(
    () => ({
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
    }),
    [style, unsupportedVideoFormatMessage, attachments, customCustomRenderers],
  );

  const systemFonts = useMemo(
    () => [...defaultSystemFonts, style.baseFont.fontFamily],
    [style.baseFont.fontFamily],
  );

  const ignoredStyles = useMemo(
    () => ['fontFamily', 'letterSpacing', 'transform', ...customIgnoredStyles],
    [customIgnoredStyles],
  );

  const renderersProps = useMemo(
    () => ({
      table: {
        cssRules,
      },
      a: { onPress: onLinkPress },
      iframe: {
        webViewProps: {
          renderToHardwareTextureAndroid: true,
        },
      },
      ...customRendererProps,
    }),
    [cssRules, onLinkPress, customRendererProps],
  );

  const customHTMLElementModels = useMemo(
    () => ({
      table: tableModel,
      iframe: iframeModel,
      video: videoModel,
      ...customHtmlElementModels,
    }),
    [customHtmlElementModels],
  );

  const domVisitors = useMemo(
    () => ({
      onElement,
      ...customDomVisitors,
    }),
    [customDomVisitors],
  );

  const filteredTagStyles = useMemo(
    () => _.omitBy(tagStyles, tagStyle => !tagStyle),
    [tagStyles],
  );

  // We have to be really careful with props passed to SimpleHtml, as they'll cause unnecessary re-renders.
  // Component is meant to be static (in almost all scenarios) - it should only render with initially given props.
  // Notice that props below are memoized to only be calculated on mount, because lots of these props non-primitive
  // (reference types), and they'll cause re-renders.
  const htmlProps = useMemo(
    () => ({
      source: { html: body },
      computeEmbeddedMaxWidth: () => maxWidth,
      contentWidth: maxWidth,
      tagsStyles: filteredTagStyles,
      systemFonts,
      baseStyle: style.baseFont,
      ignoredStyles,
      renderers: customRenderers,
      renderersProps,
      customHTMLElementModels,
      WebView,
      domVisitors,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <View style={style.container}>
      <Html {...htmlProps} {...otherProps} />
    </View>
  );
};

export default React.memo(connectStyle('shoutem.ui.SimpleHtml')(SimpleHtml));
