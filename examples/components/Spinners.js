import React from 'react';

import { Spinner } from '../../components/Spinner';
import { View } from '../../components/View';
import { Stage } from './Stage';

export function Spinners() {
  return (
    <View styleName="vertical collapsed">
      <Stage title="Spinner">
        <Spinner />
      </Stage>
    </View>
  );
}
