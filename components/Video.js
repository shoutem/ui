import React from 'react';
import { Platform } from 'react-native';
import RNVideo from 'react-native-video';
import { connectStyle } from '@shoutem/theme';

const Video = ({ style, ...props }) => (
  <RNVideo
    style={style}
    resizeMode="contain"
    textureView={Platform.select({ android: true })}
    {...props}
  />
);

const defaultStyle = {
  width: 300,
  height: 200,
};

export default connectStyle('shoutem.ui.Video', defaultStyle)(Video);
