import React from 'react';
import { ActivityIndicator, View } from 'react-native';
export default function LottieView({ style, colorFilters }) {
  const color = (colorFilters && colorFilters[0] && colorFilters[0].color) || '#659CEC';
  return <View style={[style, { alignItems: 'center', justifyContent: 'center' }]}><ActivityIndicator color={color} /></View>;
}
