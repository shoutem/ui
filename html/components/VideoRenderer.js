import React from 'react';
import {
  useComputeMaxWidthForTag,
  useContentWidth,
} from 'react-native-render-html';
import WebView from 'react-native-webview';
import { findOne } from 'domutils';
import PropTypes from 'prop-types';

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

/**
 *
 * Generate video html with only selected attributes and parameters.
 * @returns HTML video element
 */
function generateVideoHtml(tnode) {
  const url = findSource(tnode);

  const containsTimeParameter = url.match(/(#|\?)t=[^&$]*/g, '');
  // If video has no time parameter, we want to add time parameter at 0.1, just to be able to
  // display the image, first frame of the video. Video tags that don't have autoplay attribute
  // are not showing first frame without this solution.
  // Otherwise, if user has defined time parameter, keep it as is.
  const resolvedUrl = `${url}${containsTimeParameter ? '' : '#t=0.1'}`;

  return `<video controls src="${resolvedUrl}" style="width: 100%; height: 100%;"/>`;
}

export const VideoRenderer = ({ tnode, style }) => {
  const computeMaxWidth = useComputeMaxWidthForTag('video');
  const width = computeMaxWidth(useContentWidth());

  // Using uri as a Webview source is not an option, because we don't have as much control of video.
  // E.g. if video from uri has autoplay=true, we can't prevent it from auto-playing when Webview renders.
  // Instead, create video HTML element with only picked attributes and parameters.
  const html = generateVideoHtml(tnode);

  return (
    <WebView
      scrollEnabled={false}
      source={{
        html,
      }}
      style={[{ aspectRatio: 16 / 9 }, style, { width }]}
    />
  );
};

VideoRenderer.propTypes = {
  tnode: PropTypes.object.isRequired,
  style: PropTypes.object,
};

VideoRenderer.defaultProps = {
  style: {},
};

export default VideoRenderer;
