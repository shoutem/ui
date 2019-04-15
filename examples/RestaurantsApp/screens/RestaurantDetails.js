import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import {
  ScrollView,
  Icon,
  Row,
  Subtitle,
  Text,
  Title,
  View,
  ImageBackground,
  Divider,
  Tile,
  Screen,
} from '@shoutem/ui';

import { NavigationBar } from 'shoutem.navigation';

export default class RestaurantDetails extends PureComponent {
  static propTypes = {
    restaurant: PropTypes.object,
  };

  render() {
    const { restaurant } = this.props;

    return (
      <Screen styleName="paper full-screen">
        <NavigationBar
          title={restaurant.name}
          styleName="clear hide-title"
          animationName="solidify"
        />

        <ScrollView>
          <ImageBackground
            styleName="large-portrait hero"
            animationName="hero"
            source={{ uri: restaurant.image && restaurant.image.url }}
            key={restaurant.name}
          >
            <Tile animationName="hero">
              <Title>{restaurant.name}</Title>
              <Subtitle>{restaurant.address}</Subtitle>
            </Tile>
          </ImageBackground>

          <Screen styleName="paper">
            <Text styleName="md-gutter multiline">{restaurant.description}</Text>

            <Divider styleName="line" />

            <Row>
              <Icon name="laptop" />
              <View styleName="vertical">
                <Subtitle>Visit webpage</Subtitle>
                <Text numberOfLines={1}>{restaurant.url}</Text>
              </View>
            </Row>

            <Divider styleName="line" />

            <Row>
              <Icon name="pin" />
              <View styleName="vertical">
                <Subtitle>Address</Subtitle>
                <Text numberOfLines={1}>{restaurant.address}</Text>
              </View>
            </Row>

            <Divider styleName="line" />

            <Row>
              <Icon name="email" />
              <View styleName="vertical">
                <Subtitle>Email</Subtitle>
                <Text numberOfLines={1}>{restaurant.mail}</Text>
              </View>
            </Row>

            <Divider styleName="line" />
          </Screen>
        </ScrollView>
      </Screen>
    );
  }
}
