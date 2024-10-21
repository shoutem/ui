import React from 'react';
import { Vimeo } from 'react-native-vimeo-iframe';
import YoutubePlayer from 'react-native-youtube-iframe';
import iframe from '@native-html/iframe-plugin';
import PropTypes from 'prop-types';
import { Text } from '../../components/Text';
import { View } from '../../components/View';
import { isAndroid } from '../../services';
import isValidVideoFormat from '../services/isValidVideoFormat';

const IframeRenderer = props => {
  const { tnode, shoutemStyle, unsupportedVideoFormatMessage } = props;
  const url = tnode?.domNode?.attribs?.src;

  if (url && !isValidVideoFormat(url)) {
    const message =
      unsupportedVideoFormatMessage || 'Unsupported video format.';

    return (
      <View
        style={shoutemStyle.fallback}
        styleName="vertical h-center v-center"
      >
        <Text>{message}</Text>
      </View>
    );
  }

  if (url && (url.includes('youtube') || url.includes('youtu.be'))) {
    const youtubeIdRegEx = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const regExMatch = url.match(youtubeIdRegEx);
    const youtubeId =
      regExMatch && regExMatch[7].length === 11 ? regExMatch[7] : false;

    return (
      <YoutubePlayer
        webViewProps={{
          renderToHardwareTextureAndroid: true,
        }}
        height={shoutemStyle.video.height}
        videoId={youtubeId}
      />
    );
  }

  if (url && url.includes('vimeo')) {
    const vimeoIdRegEx = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i;
    const regExMatches = url.match(vimeoIdRegEx);
    const vimeoId = regExMatches[1];

    return (
      <Vimeo
        videoId={vimeoId}
        style={{ height: shoutemStyle.vimeoVideo.height }}
        // Prevents Android issue with iframee inside the scroll container
        // Scrolling to bottom crashes the app
        {...(isAndroid && {
          overScrollMode: 'never',
          androidLayerType: 'software',
        })}
      />
    );
  }

  return iframe(props);
};

IframeRenderer.propTypes = {
  tnode: PropTypes.shape({
    children: PropTypes.any,
  }).isRequired,
  shoutemStyle: PropTypes.any,
  unsupportedVideoFormatMessage: PropTypes.string,
};

IframeRenderer.defaultProps = {
  shoutemStyle: undefined,
  unsupportedVideoFormatMessage: undefined,
};

export default IframeRenderer;
