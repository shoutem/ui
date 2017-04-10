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
  // `playerParams` currently only works for Youtube
  playerParams: PropTypes.object,
  source: PropTypes.shape({
    uri: PropTypes.string,
  }),
  style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]),
};

const defaultProps = {
  playerParams: {
    showinfo: 0,
  },
};

function createSourceObject(source, playerParams) {
  const sourceReader = new VideoSourceReader(source.uri, playerParams);
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
  playerParams,
}) {
  return (
    <View style={style.container}>
      <WebView
        style={{ width, height }}
        source={createSourceObject(source, playerParams)}
        scrollEnabled={false}
      />
    </View>
  );
}

Video.propTypes = propTypes;
Video.defaultProps = defaultProps;

const AnimatedVideo = connectAnimation(Video);
const StyledVideo = connectStyle('shoutem.ui.Video', {})(AnimatedVideo);

export {
  StyledVideo as Video,
};
