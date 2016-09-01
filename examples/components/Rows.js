import React from 'react';

import { Stage } from './Stage';
import {
  View,
  Row,
  Text,
  Subtitle,
  Caption,
  Image,
  Button,
  Icon,
} from '../../index';

export function Rows() {
  return (
    <View styleName="vertical collapsed">
      <Stage title="Small list item">
        <Row>
          <Text numberOfLines={1}>Portland ugh fashion axe Helvetica, YOLO Echo Park Austin gastropub roof party.</Text>
        </Row>
      </Stage>

      <Stage title="Small list item + Avatar thumbnail">
        <Row styleName="small">
          <Image
            styleName="small-avatar"
            source={{ uri: 'http://shoutem.github.io/img/ui-toolkit/examples/image-9.png' }}
          />
          <Text>Add comment</Text>
        </Row>
      </Stage>

      <Stage title="Small list item + Icon">
        <Row styleName="small">
          <Icon name="add-to-favorites" />
          <Text>Add to favorites</Text>
        </Row>
      </Stage>

      <Stage title="Small list item + Icon + Right Arrow">
        <Row styleName="small">
          <Icon name="web" />
          <Text>About</Text>
          <Icon styleName="disclosure" name="right-arrow" />
        </Row>
      </Stage>

      <Stage title="Small list item + Icon + Description">
        <Row styleName="small">
          <Icon name="laptop" />
          <View styleName="vertical">
            <Subtitle>Bridges Rock Gym</Subtitle>
            <Text numberOfLines={1}>www.example.com/deal/link/that-is-really-long</Text>
          </View>
          <Icon styleName="disclosure" name="right-arrow" />
        </Row>
      </Stage>

      <Stage title="Small list item + Avatar + Description + Caption">
        <Row>
          <Image
            styleName="small-avatar top"
            source={{ uri: 'http://shoutem.github.io/img/ui-toolkit/examples/image-11.png' }}
          />
          <View styleName="vertical">
            <View styleName="horizontal space-between">
              <Subtitle styleName="">Dustin Malone</Subtitle>
              <Caption>20 minutes ago</Caption>
            </View>
            <Text styleName="multiline">Banjo tote bag bicycle rights, High Life sartorial cray craft beer whatever street art fap. Hashtag typewriter banh mi, squid keffiyeh High.</Text>
          </View>
        </Row>
      </Stage>

      <Stage title="Medium list item">
        <Row>
          <Image
            styleName="small rounded-corners"
            source={{ uri: 'http://shoutem.github.io/img/ui-toolkit/examples/image-10.png' }}
          />
          <Subtitle styleName="top">Portland ugh fashion axe Helvetica, YOLO Echo Park Austin gastropub roof party.</Subtitle>
        </Row>
      </Stage>

      <Stage title="Medium list item + Description">
        <Row>
          <Image
            styleName="small rounded-corners"
            source={{ uri: 'http://shoutem.github.io/img/ui-toolkit/examples/image-6.png' }}
          />
          <View styleName="vertical stretch space-between">
            <Subtitle>Fact Check: Wisconsin Music, Film & Photography Debate</Subtitle>
            <Caption>20 hours ago</Caption>
          </View>
        </Row>
      </Stage>

      <Stage title="Medium list item + Description + Icon">
        <Row>
          <Image
            styleName="small rounded-corners"
            source={{ uri: 'http://shoutem.github.io/img/ui-toolkit/examples/image-3.png' }}
          />
          <View styleName="vertical stretch space-between">
            <Subtitle>Wilco Cover David Bowie&#39;s "Space Oddity"</Subtitle>
            <Caption>June 21  ·  20:00</Caption>
          </View>
          <Button styleName="right-icon"><Icon name="add-event" /></Button>
        </Row>
      </Stage>

      <Stage title="Medium list item + Description + Icon + Label">
        <Row>
          <Image
            styleName="small rounded-corners"
            source={{ uri: 'http://shoutem.github.io/img/ui-toolkit/examples/image-11.png' }}
          />
          <View styleName="vertical stretch space-between">
            <Subtitle>Family Safari Vacation To The Home Of The Gods</Subtitle>
            <View styleName="horizontal">
              <Subtitle styleName="md-gutter-right">$120.00</Subtitle>
              <Caption styleName="line-through">$150.00</Caption>
            </View>
          </View>
          <Button styleName="right-icon"><Icon name="add-to-cart" /></Button>
        </Row>
      </Stage>

      <Stage title="Medium list item + Notification dot">
        <Row>
          <View styleName="notification-dot" />
          <Image
            styleName="small rounded-corners"
            source={{ uri: 'http://shoutem.github.io/img/ui-toolkit/examples/image-2.png' }}
          />
          <View styleName="vertical stretch space-between">
            <Subtitle>Fact Check: Wisconsin Music, Film & Photography Debate</Subtitle>
            <Caption>20 hours ago</Caption>
          </View>
        </Row>
      </Stage>

      <Stage title="Medium list item + Description + Label">
        <Row>
          <Image
            styleName="medium rounded-corners"
            source={{ uri: 'http://shoutem.github.io/img/ui-toolkit/examples/image-1.png' }}
          />
          <View styleName="vertical stretch space-between">
            <Subtitle>Take A Romantic Break In A Boutique Hotel</Subtitle>
            <View styleName="horizontal space-between">
              <Caption>3 days ago</Caption>
              <Caption>12:16</Caption>
            </View>
          </View>
        </Row>
      </Stage>
    </View>
  );
}
