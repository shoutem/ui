import React from 'react';
import { Text, View } from 'react-native';
export function Vimeo({ videoId }) {
  return <View style={{ height: 200, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#ddd' }}>Vimeo player ({videoId}) is not embeddable in this preview</Text></View>;
}
export default Vimeo;
