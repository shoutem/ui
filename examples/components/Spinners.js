import React from 'react';

import { View } from '../../components/View';
import { Spinner } from '../../components/Spinner';
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
