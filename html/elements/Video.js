import React from 'react';
import PropTypes from 'prop-types';
import { Video as UIVideo } from '../../components/Video';
import { View } from '../../components/View';
import Image from '../components/Image';
import { combineMappers, mapElementProps } from '../Html';

/**
 * Transform a video to RN component with props.
 */
function Video({ src, thumbnailUrl, style }) {
  // TODO - Find out if there is a better way to keep the video aspect ratio then with Image
  // A thumbnail is used to scale the video properly (because it holds the video aspect ratio)
  return (
    <Image source={{ uri: thumbnailUrl }} style={style.container} allowUpscale>
      <View styleName="fill-parent">
        <UIVideo source={{ uri: src }} poster={thumbnailUrl} />
      </View>
    </Image>
  );
}

Video.propTypes = {
  src: PropTypes.string,
  style: PropTypes.object,
  thumbnailUrl: PropTypes.string,
};

Video.defaultProps = {
  src: undefined,
  style: {
    container: {
      alignSelf: 'stretch',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  thumbnailUrl: undefined,
};

export default combineMappers(mapElementProps)(Video);
