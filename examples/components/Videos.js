import React from 'react';
import { Video } from '../../components/Video';
import { View } from '../../components/View';
import { Stage } from './Stage';

export function Videos() {
  return (
    <View styleName="vertical collapsed">
      <Stage title="YouTube video">
        <Video
          source={{ uri: 'https://www.youtube.com/embed/2zuisMXzyaI' }}
          width={320}
          height={180}
        />
      </Stage>
      <Stage title="Vimeo video">
        <Video
          source={{ uri: 'https://vimeo.com/182267614' }}
          width={320}
          height={180}
        />
      </Stage>
      <Stage title="Stream video">
        <Video
          source={{
            uri:
              'https://archive.org/download/Sintel/sintel-2048-stereo_512kb.mp4',
          }}
          width={320}
          height={180}
        />
      </Stage>
    </View>
  );
}
