import { useEffect } from 'react';
export function useFocusEffect(cb) { useEffect(() => cb(), [cb]); }
export function useNavigation() { return { navigate() {}, goBack() {}, addListener: () => () => {} }; }
export function useIsFocused() { return true; }
