import React from 'react';
import { Text, View } from 'react-native';
export default function YoutubePlayer({ height = 200, videoId }) {
  return <View style={{ height, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#ddd' }}>YouTube player ({videoId}) is not embeddable in this preview</Text></View>;
}
