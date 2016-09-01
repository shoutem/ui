import React, {
  PropTypes,
} from 'react';

import {
  View,
} from 'react-native';

import { connectStyle } from '@shoutem/theme';

import { NativeVideo } from './NativeVideo';
import { WebViewVideo } from './WebViewVideo';
import VideoSourceReader from './VideoSourceReader';

const propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  source: PropTypes.string,
  style: PropTypes.object,
};

/**
 * Renders a Video based on the source type
 * if source is an url to a web player the
 * it is displayed in a WebView, if not
 * a native video player plays the video.
 *
 * @returns {*}
 */
function Video({
  width,
  height,
  source,
  style,
}) {
  const sourceReader = new VideoSourceReader(source);
  let VideoElement = NativeVideo;

  if (sourceReader.isWebVideo()) {
    VideoElement = WebViewVideo;
  }

  return (
    <View style={[style.container, { width, height }]}>
      <VideoElement
        source={{ uri: sourceReader.getUrl() }}
        width={width}
        height={height}
      />
    </View>
  );
}

Video.propTypes = propTypes;

const StyledVideo = connectStyle('shoutem.ui.Video', {})(Video);

export {
  StyledVideo as Video,
};
