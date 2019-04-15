import React from 'react';

import { Caption } from '../../components/Text';
import { View } from '../../components/View';
import { Divider } from '../../components/Divider';
import { Stage } from './Stage';

export function Dividers() {
  return (
    <View styleName="vertical collapsed">
      <Stage title="Divider">
        <Divider />
      </Stage>

      <Stage title="Line divider">
        <Divider styleName="line" />
      </Stage>

      <Stage title="Section divider">
        <Divider styleName="section-header" />
      </Stage>

      <Stage title="Section divider + label">
        <Divider styleName="section-header">
          <Caption>INFORMATION</Caption>
        </Divider>
      </Stage>

      <Stage title="Section divider + label + caption">
        <Divider styleName="section-header">
          <Caption>PRODUCT NAME</Caption>
          <Caption>PRICE</Caption>
        </Divider>
      </Stage>
    </View>
  );
}
