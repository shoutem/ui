import React from 'react';

import { View } from '../../components/View';
import { Stage } from './Stage';
import { Image } from '../../components/Image';
import { Video } from '../../components/Video'
import { WebView } from 'react-native';

export function Videos() {
  return (
    <View styleName="vertical collapsed">
      <Stage title={"YouTube video"}>
        <Video
          source={{uri: "https://www.youtube.com/embed/GCSeAiScMfg"}}
          width={320}
          height={180}
        />
      </Stage>
      <Stage title={"Vimeo video"}>
        <Video
          width={320}
          height={180}
          source={{uri: "https://vimeo.com/182267614"}}
        />
      </Stage>
      <Stage title={"Stream video"}>
        <Video
          source={{uri: "https://archive.org/download/WebmVp8Vorbis/webmvp8_512kb.mp4"}}
          width={320}
          height={180}
        />
      </Stage>
    </View>
  );
}
