import React from 'react';

import { Stage } from './Stage';
import {
  View,
  Spinner,
} from '../../index';

export function Spinners() {
  return (
    <View styleName="vertical collapsed">
      <Stage title="Spinner">
        <Spinner />
      </Stage>
    </View>
  );
}
