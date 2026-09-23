import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { Vimeo } from 'react-native-vimeo-iframe';
import { WebView } from 'react-native-webview';
import YoutubePlayer from 'react-native-youtube-iframe';
import PropTypes from 'prop-types';
import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';
import { isAndroid } from '../../services';
import VideoSourceReader from './VideoSourceReader';

function getSource(sourceReader, poster, headers) {
  const url = sourceReader.getUrl();
  let source;

  if (sourceReader.isEmbeddableVideo()) {
    source = { uri: url };
  } else {
    const HTML = `
      <video width="100%" height="auto" poster="${poster}" controls  >
         <source src="${url}" >
       </video>
    `;

    source = { html: HTML };
  }

  if (headers) {
    source.headers = headers;
  }

  return source;
}

// YouTube/Vimeo iframe players require a numeric height (they can't take
// '100%'), so resolve one from the height prop, then the themed container
// height, then a default.
function resolveEmbedHeight(height, style) {
  if (typeof height === 'number') {
    return height;
  }

  const containerHeight = style?.container?.height;

  if (typeof containerHeight === 'number') {
    return containerHeight;
  }

  return 240;
}

/**
 * Renders a video based on its source type. YouTube and Vimeo go through their
 * dedicated iframe players so the embed loads with a valid origin - a bare
 * YouTube embed in a plain WebView has no Referer and fails with "Error 153".
 * Any other source is rendered as an HTML5 video inside a WebView.
 */
class Video extends PureComponent {
  constructor(props) {
    super(props);

    const { source, playerParams } = props;
    this.sourceReader = new VideoSourceReader(source.uri, playerParams);
  }

  render() {
    const {
      width,
      height = '100%',
      style,
      poster,
      headers,
      playerParams,
    } = this.props;

    if (this.sourceReader.isYouTube) {
      return (
        <View style={style.container}>
          <YoutubePlayer
            videoId={this.sourceReader.getYouTubeId()}
            height={resolveEmbedHeight(height, style)}
            initialPlayerParams={playerParams}
            webViewProps={{ renderToHardwareTextureAndroid: true }}
          />
        </View>
      );
    }

    if (this.sourceReader.isVimeo) {
      return (
        <View style={style.container}>
          <Vimeo
            videoId={this.sourceReader.getVimeoId()}
            style={{ height: resolveEmbedHeight(height, style) }}
            {...(isAndroid && {
              overScrollMode: 'never',
              androidLayerType: 'software',
            })}
          />
        </View>
      );
    }

    const webViewSource = getSource(this.sourceReader, poster, headers);

    return (
      <View style={style.container}>
        <WebView
          allowsFullscreenVideo
          mediaPlaybackRequiresUserAction={false}
          style={{ width, height }}
          source={webViewSource}
          scrollEnabled={false}
          originWhitelist={['*']}
        />
      </View>
    );
  }
}

Video.propTypes = {
  style: PropTypes.object.isRequired,
  headers: PropTypes.object,
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
  headers: undefined,
  height: undefined,
  playerParams: { showinfo: 0 },
  source: undefined,
  poster: undefined,
};

const AnimatedVideo = connectAnimation(Video);
const StyledVideo = connectStyle('shoutem.ui.Video')(AnimatedVideo);

export { StyledVideo as Video };
