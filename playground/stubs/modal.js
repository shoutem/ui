import React from 'react';
import { Pressable, View } from 'react-native';
export default function Modal({ isVisible, children, onBackdropPress, backdropOpacity = 0.7, style }) {
  if (!isVisible) return null;
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 40, justifyContent: 'center', padding: 20 }}>
      <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: `rgba(0,0,0,${backdropOpacity || 0.5})` }} onPress={onBackdropPress} />
      <View style={style}>{children}</View>
    </View>
  );
}
