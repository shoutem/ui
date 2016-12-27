import React, {
  PropTypes,
} from 'react';

import {
  View,
  WebView,
} from 'react-native';

import { connectStyle } from '@shoutem/theme';
import { connectAnimation } from '@shoutem/animation';
import VideoSourceReader from './VideoSourceReader';

const propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  youtubeParams: PropTypes.string,
  source: PropTypes.shape({
    uri: PropTypes.string,
  }),
  style: PropTypes.object,
};

function createSourceObject(source, youtubeParams) {
  const sourceReader = new VideoSourceReader(source.uri, youtubeParams);
  const url = sourceReader.getUrl();

  if (sourceReader.isEmbeddableVideo()) {
    return {
      uri: url,
    };
  }

  const HTML = `
    <video width="100%" height="auto" controls  >
       <source src="${url}" >
     </video>
  `;

  return {
    html: HTML,
  };
}

/**
 * Renders a Video based on the source type
 * if source is an url to a web player the
 * it is displayed in a WebView, if not
 * a Video HTML element is displayed in the
 * WebView.
 *
 * @returns {*}
 */
function Video({
  width,
  height,
  source,
  style,
  youtubeParams,
}) {
  return (
    <View style={style.container}>
      <WebView
        style={{ width, height }}
        source={createSourceObject(source, youtubeParams)}
        scrollEnabled={false}
      />
    </View>
  );
}

Video.propTypes = propTypes;

const AnimatedVideo = connectAnimation(Video);
const StyledVideo = connectStyle('shoutem.ui.Video', {})(AnimatedVideo);

export {
  StyledVideo as Video,
};
