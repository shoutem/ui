import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';
import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';
import VideoSourceReader from './VideoSourceReader';

function getSource(sourceReader, poster) {
  const url = sourceReader.getUrl();

  if (sourceReader.isEmbeddableVideo()) {
    return {
      uri: url,
    };
  }

  const HTML = `
    <video width="100%" height="auto" poster="${poster}" controls  >
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
class Video extends PureComponent {
  constructor(props) {
    super(props);

    const { source, playerParams } = props;
    this.sourceReader = new VideoSourceReader(source.uri, playerParams);
  }

  render() {
    const { width, height = '100%', style, poster } = this.props;

    return (
      <View style={style.container}>
        <WebView
          allowsFullscreenVideo
          mediaPlaybackRequiresUserAction={false}
          style={{ width, height }}
          source={getSource(this.sourceReader, poster)}
          scrollEnabled={false}
          originWhitelist={['*']}
        />
      </View>
    );
  }
}

Video.propTypes = {
  style: PropTypes.object.isRequired,
  height: PropTypes.number,
  // `playerParams` currently only works for Youtube
  playerParams: PropTypes.object,
  poster: PropTypes.string,
  source: PropTypes.shape({
    uri: PropTypes.string,
  }),
  width: PropTypes.number,
};

Video.defaultProps = {
  width: undefined,
  height: undefined,
  playerParams: { showinfo: 0 },
  source: undefined,
  poster: undefined,
};

const AnimatedVideo = connectAnimation(Video);
const StyledVideo = connectStyle('shoutem.ui.Video')(AnimatedVideo);

export { StyledVideo as Video };
