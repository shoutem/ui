import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Pressable, View } from 'react-native';
const ActionSheet = forwardRef(function ActionSheet({ children, onClose, containerStyle }, ref) {
  const [visible, setVisible] = useState(false);
  useImperativeHandle(ref, () => ({ show: () => setVisible(true), hide: () => setVisible(false) }), []);
  if (!visible) return null;
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 40, justifyContent: 'flex-end' }}>
      <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' }}
        onPress={() => { setVisible(false); onClose && onClose(); }} />
      <View style={containerStyle}>{children}</View>
    </View>
  );
});
export default ActionSheet;
