import React from 'react';

import { Stage } from './Stage';
import {
  Heading,
  View,
  Tile,
  Text,
  Title,
  Subtitle,
  Caption,
  Icon,
  Overlay,
  Button,
} from '../../index';

export function Headers() {
  return (
    <View styleName="vertical collapsed">
      <Stage title="Header / Article">
        <Tile styleName="text-centric">
          <Title styleName="sm-gutter-bottom">MIKE PATTON TEAMING WITH JOHN KAADA FOR COLLAB ALBUM BACTERIA CULT</Title>
          <Caption>Sophia Jackson        21 hours ago</Caption>
        </Tile>
      </Stage>

      <Stage title="Header / Shop item">
        <Tile styleName="text-centric">
          <Overlay><Heading>-20%</Heading></Overlay>
          <Title styleName="md-gutter-top">COOL BLACK AND WHITE STYLISH WATCHES</Title>
          <Subtitle styleName="line-through sm-gutter-top">$280.00</Subtitle>
          <Heading>$250.00</Heading>
          <Button styleName="dark md-gutter-top"><Icon name="cart" /><Text>ADD TO BASKET</Text></Button>
        </Tile>
      </Stage>

      <Stage title="Header / Deals item">
        <Tile styleName="text-centric">
          <Title>MIKE PATTON TEAMING WITH JOHN KAADA</Title>
          <Subtitle styleName="line-through sm-gutter-top">150.00</Subtitle>
          <Heading>99.99</Heading>
          <Button styleName="dark md-gutter-top"><Text>CLAIM COUPON</Text></Button>
        </Tile>
      </Stage>

      <Stage title="Header / Products item">
        <Tile styleName="text-centric">
          <Title styleName="md-gutter-bottom">SMOKED SALMON, CLASSIC CONDIMENTS, BRIOCHE</Title>
          <Overlay styleName="solid-dark">
            <Subtitle styleName="sm-gutter-horizontal">$18.30</Subtitle>
          </Overlay>
        </Tile>
      </Stage>
    </View>
  );
}
