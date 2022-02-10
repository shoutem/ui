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
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    // `playerParams` currently only works for Youtube
    playerParams: PropTypes.object,
    source: PropTypes.shape({
      uri: PropTypes.string,
    }),
    style: PropTypes.object,
    poster: PropTypes.string,
  };

  static defaultProps = {
    playerParams: {
      showinfo: 0,
    },
  };

  constructor(props) {
    super(props);

    const { source, playerParams } = props;
    this.sourceReader = new VideoSourceReader(source.uri, playerParams);
  }

  render() {
    const { width, height, style, poster } = this.props;

    // https://github.com/vimeo/player.js/issues/514
    // Vimeo player crashes the app, if played in full screen portrait mode and if user
    // tries to navigate back using Android hardware back button. Disableing full screen
    // option for Vimeo until their player is fixed.
    const isYoutubeVideo = this.sourceReader.isYouTube;

    return (
      <View style={style.container}>
        <WebView
          allowsFullscreenVideo={isYoutubeVideo}
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

const AnimatedVideo = connectAnimation(Video);
const StyledVideo = connectStyle('shoutem.ui.Video')(AnimatedVideo);

export { StyledVideo as Video };
