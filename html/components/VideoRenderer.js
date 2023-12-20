import React from 'react';
import {
  useComputeMaxWidthForTag,
  useContentWidth,
} from 'react-native-render-html';
import WebView from 'react-native-webview';
import { findOne } from 'domutils';

function findSource(tnode) {
  if (tnode.attributes.src) {
    return tnode.attributes.src;
  }
  const sourceElms = findOne(
    elm => elm.tagName === 'source',
    tnode.domNode.children,
  );
  return sourceElms ? sourceElms.attribs.src : '';
}

const VideoRenderer = props => {
  const { tnode, style } = props;

  const computeMaxWidth = useComputeMaxWidthForTag('video');
  const width = computeMaxWidth(useContentWidth());

  return (
    <WebView
      scrollEnabled={false}
      source={{ uri: findSource(tnode) }}
      style={[{ aspectRatio: 16 / 9 }, style, { width }]}
    />
  );
};

export default VideoRenderer;
