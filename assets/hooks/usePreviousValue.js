import { useEffect, useRef } from 'react';

export function usePreviousValue(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
