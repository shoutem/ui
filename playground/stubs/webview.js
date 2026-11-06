import React from 'react';
import { View } from 'react-native';
export function WebView({ source = {}, style }) {
  const src = source.uri; const html = source.html;
  return <View style={style}>{React.createElement('iframe', { src, srcDoc: html, style: { border: 0, width: '100%', height: '100%', minHeight: 200 } })}</View>;
}
export default WebView;
