import React from 'react';

import { Text, Caption, Subtitle, Title, Heading } from '../../components/Text';
import { Icon } from '../../components/Icon';
import { View } from '../../components/View';
import { Tile } from '../../components/Tile';
import { Button } from '../../components/Button';
import { Overlay } from '../../components/Overlay';
import { Stage } from './Stage';

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
          <Overlay styleName="image-overlay"><Heading>-20%</Heading></Overlay>
          <Title styleName="md-gutter-top">COOL BLACK AND WHITE STYLISH WATCHES</Title>
          <Subtitle styleName="line-through sm-gutter-top">$280.00</Subtitle>
          <Heading>$250.00</Heading>
          <Button styleName="secondary md-gutter-top"><Icon name="cart" /><Text>ADD TO BASKET</Text></Button>
        </Tile>
      </Stage>

      <Stage title="Header / Deals item">
        <Tile styleName="text-centric">
          <Title>MIKE PATTON TEAMING WITH JOHN KAADA</Title>
          <Subtitle styleName="line-through sm-gutter-top">150.00</Subtitle>
          <Heading>99.99</Heading>
          <Button styleName="secondary md-gutter-top"><Text>CLAIM COUPON</Text></Button>
        </Tile>
      </Stage>

      <Stage title="Header / Products item">
        <Tile styleName="text-centric">
          <Title styleName="md-gutter-bottom">SMOKED SALMON, CLASSIC CONDIMENTS, BRIOCHE</Title>
          <Overlay styleName="image-overlay">
            <Subtitle styleName="sm-gutter-horizontal">$18.30</Subtitle>
          </Overlay>
        </Tile>
      </Stage>
    </View>
  );
}
