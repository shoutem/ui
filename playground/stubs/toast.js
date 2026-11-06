// Stand-in for react-native-toast-message: <Toast config/> host + static show/hide.
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
const listeners = new Set();
let current = null;
let timer = null;
const emit = () => listeners.forEach(l => l(current));
function Toast({ config = {} }) {
  const [t, setT] = useState(current);
  useEffect(() => { listeners.add(setT); return () => listeners.delete(setT); }, []);
  if (!t) return null;
  const render = config[t.type];
  if (!render) return null;
  const top = t.position !== 'bottom';
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, [top ? 'top' : 'bottom']: (top ? t.topOffset : t.bottomOffset) || 48, zIndex: 60, alignItems: 'center' }}>
      {render({ ...t, isVisible: true, hide: Toast.hide })}
    </View>
  );
}
Toast.show = opts => {
  clearTimeout(timer);
  current = opts; emit();
  opts.onShow && opts.onShow();
  if (opts.autoHide !== false) timer = setTimeout(() => Toast.hide(), opts.visibilityTime || 4000);
};
Toast.hide = () => {
  clearTimeout(timer);
  const prev = current; current = null; emit();
  prev && prev.onHide && prev.onHide();
};
export default Toast;
