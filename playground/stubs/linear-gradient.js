import React from 'react';
import { View, StyleSheet } from 'react-native';
export default function LinearGradient({ colors = [], locations, start = { x: 0.5, y: 0 }, end = { x: 0.5, y: 1 }, style, children, ...rest }) {
  const angle = Math.atan2((end.x - start.x), -(end.y - start.y)) * 180 / Math.PI;
  const stops = colors.map((c, i) => (locations ? `${c} ${locations[i] * 100}%` : c)).join(', ');
  const flat = StyleSheet.flatten(style) || {};
  return <View {...rest} style={[flat, { backgroundImage: `linear-gradient(${angle}deg, ${stops})` }]}>{children}</View>;
}
export { LinearGradient };
