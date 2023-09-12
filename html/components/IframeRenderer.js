import React from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';
import iframe from '@native-html/iframe-plugin';
import PropTypes from 'prop-types';
import { Text } from '../../components/Text';
import { View } from '../../components/View';
import isValidVideoFormat from '../services/isValidVideoFormat';

const IframeRenderer = ({
  tnode: { attributes, children },
  shoutemStyle,
  style,
  unsupportedVideoFormatMessage,
  passProps,
}) => {
  const url = attributes?.src;

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

  return iframe(attributes, children, style, passProps);
};

IframeRenderer.propTypes = {
  tnode: PropTypes.shape({
    attributes: PropTypes.any,
    children: PropTypes.any,
  }).isRequired,
  passProps: PropTypes.any,
  shoutemStyle: PropTypes.oneOf([PropTypes.array, PropTypes.object]),
  style: PropTypes.any,
  unsupportedVideoFormatMessage: PropTypes.string,
};

IframeRenderer.defaultProps = {
  passProps: undefined,
  style: undefined,
  shoutemStyle: undefined,
  unsupportedVideoFormatMessage: undefined,
};

export default IframeRenderer;
