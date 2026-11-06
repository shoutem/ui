import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
export default function Lightbox({ children, renderContent, activeProps, onOpen, onClose, style }) {
  const [open, setOpen] = useState(false);
  const content = renderContent ? renderContent() : (activeProps && React.isValidElement(children) ? React.cloneElement(children, activeProps) : children);
  return (
    <View style={style}>
      <Pressable onPress={() => { setOpen(true); onOpen && onOpen(); }}>{children}</Pressable>
      {open && (
        <Pressable onPress={() => { setOpen(false); onClose && onClose(); }}
          style={{ position: 'fixed', inset: 0, zIndex: 50, backgroundColor: 'rgba(0,0,0,0.92)', alignItems: 'stretch', justifyContent: 'center' }}>
          {content}
        </Pressable>
      )}
    </View>
  );
}
