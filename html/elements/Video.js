import React from 'react';
import { View } from '../../components/View';
import { Video as UIVideo } from '../../components/Video';
import Image from '../components/Image';
import { combineMappers, mapElementProps } from '../Html';

/**
 * Transform a video to RN component with props.
 */
function Video({ src, thumbnail_url, style }) {
  // TODO - Find out if there is a better way to keep the video aspect ratio then with Image
  // A thumbnail is used to scale the video properly (because it holds the video aspect ratio)
  return (
    <Image
      source={{ uri: thumbnail_url }}
      style={style.container}
      keepRatio={false}
    >
      <View styleName="fill-parent">
        <UIVideo source={{ uri: src }} poster={thumbnail_url} />
      </View>
    </Image>
  );
}

Video.propTypes = {
  src: React.PropTypes.string,
  thumbnail_url: React.PropTypes.string,
  style: React.PropTypes.object,
};

Video.defaultProps = {
  style: {
    container: {
      alignSelf: 'stretch',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
};

export default combineMappers(mapElementProps)(Video);
