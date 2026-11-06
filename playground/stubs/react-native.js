// react-native-web, with Dimensions pinned to the 375×812 preview device so theme.js
// responsiveWidth/responsiveHeight and window-based sizes match a phone.
export * from 'react-native-web';
const PHONE = { width: 375, height: 812, scale: 2, fontScale: 1 };
export const Dimensions = {
  get: () => ({ ...PHONE }),
  set: () => {},
  addEventListener: () => ({ remove() {} }),
  removeEventListener: () => {},
};
export function useWindowDimensions() { return { ...PHONE }; }
