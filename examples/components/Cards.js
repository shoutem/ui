import React from 'react';

import { Stage } from './Stage';
import {
  View,
  Card,
  Image,
  Subtitle,
  Caption,
  Icon,
  Button,
} from '../../index';

export function Cards() {
  return (
    <View styleName="vertical collapsed">
      <Stage title="Card">
        <Card>
          <Image
            styleName="medium-wide"
            source={{ uri: 'http://shoutem.github.io/img/ui-toolkit/examples/image-10.png' }}
          />
          <View styleName="content">
            <Subtitle>Choosing The Right Boutique Hotel For You</Subtitle>
            <Caption>21 hours ago</Caption>
          </View>
        </Card>
      </Stage>

      <Stage title="Card + Icon">
        <Card>
          <Image
            styleName="medium-wide"
            source={{ uri: 'http://shoutem.github.io/img/ui-toolkit/examples/image-12.png' }}
          />
          <View styleName="content">
            <Subtitle>Choosing The Right Boutique Hotel For You</Subtitle>
            <View styleName="horizontal v-center space-between">
              <Caption>Dec 21, 13:45</Caption>
              <Button styleName="tight clear"><Icon name="add-event" /></Button>
            </View>
          </View>
        </Card>
      </Stage>

      <Stage title="Card + Icon (Shop)">
        <Card>
          <Image
            styleName="medium-wide"
            source={{ uri: 'http://shoutem.github.io/img/ui-toolkit/examples/image-11.png' }}
          />
          <View styleName="content">
            <Subtitle>Choosing The Right Boutique Hotel For You</Subtitle>
            <View styleName="horizontal v-center space-between">
              <View styleName="horizontal">
                <Subtitle styleName="md-gutter-right">$99.99</Subtitle>
                <Caption styleName="line-through">$120.00</Caption>
              </View>
              {
                // TODO (zeljko): Should we add an IconButton?
                // <IconButton icon="cart" onPress={...} />
              }
              <Button styleName="tight clear"><Icon name="cart" /></Button>
            </View>
          </View>
        </Card>
      </Stage>
    </View>
  );
}
