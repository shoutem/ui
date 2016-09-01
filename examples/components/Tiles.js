import React from 'react';

import { Stage } from './Stage';
import {
  Heading,
  View,
  Tile,
  Image,
  Text,
  Title,
  Subtitle,
  Caption,
  Icon,
  Overlay,
  Button,
} from '../../index';

export function Tiles() {
  return (
    <View styleName="vertical collapsed">
      <Stage title="Tile">
        <Tile styleName="small clear">
          <Image
            styleName="medium-square"
            source={{ uri: 'http://shoutem.github.io/img/ui-toolkit/examples/image-12.png' }}
          />
          <View styleName="content">
            <Subtitle numberOfLines={2}>When The Morning Dawns - DJ Silver Sample Album</Subtitle>
            <Caption>20 hours ago</Caption>
          </View>
        </Tile>
      </Stage>

      <Stage title="Tile + Icon">
        <Tile styleName="small clear">
          <Image
            styleName="medium-square"
            source={{ uri: 'http://shoutem.github.io/img/ui-toolkit/examples/image-2.png' }}
          >
            <Overlay styleName="rounded-small">
              <Icon name="play" />
            </Overlay>
          </Image>
          <View styleName="content">
            <Subtitle numberOfLines={2}>When The Morning Dawns - DJ Silver Sample Album</Subtitle>
            <Caption>20 hours ago</Caption>
          </View>
        </Tile>
      </Stage>

      <Stage title="Large (featured) tile">
        <Image
          styleName="featured"
          source={{ uri: 'http://shoutem.github.io/img/ui-toolkit/examples/image-4.png' }}
        >
          <Tile>
            <Title styleName="md-gutter-bottom">MIKE PATTON TEAMING WITH JOHN KAADA FOR COLLAB ALBUM BACTERIA CULT</Title>
            <Caption>Sophia Jackson        21 hours ago</Caption>
          </Tile>
        </Image>
      </Stage>

      <Stage title="Large (featured) tile + Button + Sale tag">
        <Image
          styleName="featured"
          source={{ uri: 'http://shoutem.github.io/img/ui-toolkit/examples/image-11.png' }}
        >
          <Tile>
            <Overlay><Heading>-20%</Heading></Overlay>
            <Title styleName="md-gutter-top">COOL BLACK AND WHITE STYLISH WATCHES</Title>
            <Subtitle styleName="line-through sm-gutter-top">$280.00</Subtitle>
            <Heading>$250.00</Heading>
            <Button styleName="md-gutter-top"><Icon name="cart" /><Text>ADD TO BASKET</Text></Button>
          </Tile>
        </Image>
      </Stage>

      <Stage title="Large (featured) tile + Button">
        <Image
          styleName="featured"
          source={{ uri: 'http://shoutem.github.io/img/ui-toolkit/examples/image-9.png' }}
        >
          <Tile>
            <Title>MIKE PATTON TEAMING WITH JOHN KAADA</Title>
            <Subtitle styleName="line-through sm-gutter-top">150.00</Subtitle>
            <Heading>99.99</Heading>
            <Button styleName="md-gutter-top"><Text>CLAIM COUPON</Text></Button>
          </Tile>
        </Image>
      </Stage>

      <Stage title="Large list item">
        <Tile>
          <Image
            styleName="large-banner"
            source={{ uri: 'http://shoutem.github.io/img/ui-toolkit/examples/image-5.png' }}
          />
          <View styleName="content">
            <Title>MAUI BY AIR THE BEST WAY AROUND THE ISLAND</Title>
            <View styleName="horizontal space-between">
              <Caption>1 hour ago</Caption>
              <Caption>15:34</Caption>
            </View>
          </View>
        </Tile>
      </Stage>

      <Stage title="Large list item + Icon + Timestamp">
        <Tile>
          <Image
            styleName="large-banner"
            source={{ uri: 'http://shoutem.github.io/img/ui-toolkit/examples/image-7.png' }}
          >
            <Overlay styleName="rounded-small">
              <Icon name="play" />
            </Overlay>
          </Image>
          <View styleName="content">
            <Title>MAUI BY AIR THE BEST WAY AROUND THE ISLAND</Title>
            <View styleName="horizontal space-between">
              <Caption>1 hour ago</Caption>
              <Caption>15:34</Caption>
            </View>
          </View>
        </Tile>
      </Stage>

      <Stage title="Large list item + Price tag">
        <Image
          styleName="large-banner"
          source={{ uri: 'http://shoutem.github.io/img/ui-toolkit/examples/image-3.png' }}
        >
          <Tile>
            <Title styleName="md-gutter-bottom">SMOKED SALMON, CLASSIC CONDIMENTS, BRIOCHE</Title>
            <Overlay styleName="solid-bright">
              <Subtitle styleName="sm-gutter-horizontal">$18.30</Subtitle>
            </Overlay>
          </Tile>
        </Image>
      </Stage>

      <Stage title="Large list item + Action icon">
        <Image
          styleName="large-banner"
          source={{ uri: 'http://shoutem.github.io/img/ui-toolkit/examples/image-3.png' }}
        >
          <Tile>
            <View styleName="actions">
              <Button styleName="tight clear"><Icon name="add-to-favorites" /></Button>
            </View>
            <Title>HOW TO MAINTAIN YOUR MENTAL HEALTH IN 2016</Title>
            <Caption>6557 Americo Hills Apt. 118</Caption>
          </Tile>
        </Image>
      </Stage>

      <Stage title="Detail square + Price tag">
        <Image
          styleName="large-square"
          source={{ uri: 'http://shoutem.github.io/img/ui-toolkit/examples/image-3.png' }}
        >
          <Tile>
            <Title styleName="md-gutter-bottom">SMOKED SALMON, CLASSIC CONDIMENTS, BRIOCHE</Title>
            <Overlay styleName="solid-bright">
              <Subtitle styleName="sm-gutter-horizontal">$18.30</Subtitle>
            </Overlay>
          </Tile>
        </Image>
      </Stage>

      <Stage title="Detail square + Button">
        <Image
          styleName="large-square"
          source={{ uri: 'http://shoutem.github.io/img/ui-toolkit/examples/image-9.png' }}
        >
          <Tile>
            <Title>MIKE PATTON TEAMING WITH JOHN KAADA</Title>
            <Subtitle styleName="line-through sm-gutter-top">150.00</Subtitle>
            <Heading>99.99</Heading>
            <Button styleName="md-gutter-top"><Text>CLAIM COUPON</Text></Button>
          </Tile>
        </Image>
      </Stage>

      <Stage title="Detail square + Button + Sale tag">
        <Image
          styleName="large-square"
          source={{ uri: 'http://shoutem.github.io/img/ui-toolkit/examples/image-11.png' }}
        >
          <Tile>
            <Overlay><Heading>-20%</Heading></Overlay>
            <Title styleName="md-gutter-top">COOL BLACK AND WHITE STYLISH WATCHES</Title>
            <Subtitle styleName="line-through sm-gutter-top">$280.00</Subtitle>
            <Heading>$250.00</Heading>
            <Button styleName="md-gutter-top"><Icon name="cart" /><Text>ADD TO BASKET</Text></Button>
          </Tile>
        </Image>
      </Stage>

      <Stage title="Detail large + Price tag">
        <Image
          styleName="large-portrait"
          source={{ uri: 'http://shoutem.github.io/img/ui-toolkit/examples/image-3.png' }}
        >
          <Tile>
            <Title styleName="md-gutter-bottom">SMOKED SALMON, CLASSIC CONDIMENTS, BRIOCHE</Title>
            <Overlay styleName="solid-bright">
              <Subtitle styleName="sm-gutter-horizontal">$18.30</Subtitle>
            </Overlay>
          </Tile>
        </Image>
      </Stage>

      <Stage title="Detail large + Button">
        <Image
          styleName="large-portrait"
          source={{ uri: 'http://shoutem.github.io/img/ui-toolkit/examples/image-9.png' }}
        >
          <Tile>
            <Title>MIKE PATTON TEAMING WITH JOHN KAADA</Title>
            <Subtitle styleName="line-through sm-gutter-top">150.00</Subtitle>
            <Heading>99.99</Heading>
            <Button styleName="md-gutter-top"><Text>CLAIM COUPON</Text></Button>
          </Tile>
        </Image>
      </Stage>

      <Stage title="Detail large + Button + Sale tag">
        <Image
          styleName="large-portrait"
          source={{ uri: 'http://shoutem.github.io/img/ui-toolkit/examples/image-11.png' }}
        >
          <Tile>
            <Overlay><Heading>-20%</Heading></Overlay>
            <Title styleName="md-gutter-top">COOL BLACK AND WHITE STYLISH WATCHES</Title>
            <Subtitle styleName="line-through sm-gutter-top">$280.00</Subtitle>
            <Heading>$250.00</Heading>
            <Button styleName="md-gutter-top"><Icon name="cart" /><Text>ADD TO BASKET</Text></Button>
          </Tile>
        </Image>
      </Stage>
    </View>
  );
}
