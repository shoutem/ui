import React from 'react';

import { View } from '../../components/View';
import { Stage } from './Stage';
import {
  Text,
  Heading,
  Title,
  Subtitle,
  Description,
  Caption,
} from '../../components/Text';

export function Typography() {
  return (
    <View styleName="vertical collapsed">
      <Stage title="Heading">
        <Heading>Mobile App Creator</Heading>
      </Stage>

      <Stage title="Title">
        <Title>MOBILE APP CREATOR</Title>
      </Stage>

      <Stage title="Subtitle">
        <Subtitle>Mobile App Creator</Subtitle>
      </Stage>

      <Stage title="Text">
        <Text>Mobile App Creator</Text>
      </Stage>

      <Stage title="Caption">
        <Caption>Mobile App Creator</Caption>
      </Stage>
    </View>
  );
}
