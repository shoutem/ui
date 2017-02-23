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
  source: PropTypes.shape({
    uri: PropTypes.string,
  }),
  style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]),
};

function createSourceObject(source) {
  const sourceReader = new VideoSourceReader(source.uri);
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
}) {
  return (
    <View style={style.container}>
      <WebView
        style={{ width, height }}
        source={createSourceObject(source)}
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
