import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  Icon,
  Row,
  Subtitle,
  Text,
  Title,
  View,
  Image,
  Divider,
  Tile,
  Screen,
} from '@shoutem/ui';

import {
  NavigationBar,
} from '@shoutem/ui/navigation';

export default class RestaurantDetails extends Component {
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
          <Image
            styleName="large-portrait hero"
            animationName="hero"
            source={{ uri: restaurant.image && restaurant.image.url }}
            key={restaurant.name}
          >
            <Tile animationName="hero">
              <Title>{restaurant.name}</Title>
              <Subtitle>{restaurant.address}</Subtitle>
            </Tile>
          </Image>

          <Screen styleName="paper">
            <Text styleName="md-gutter multiline">{restaurant.description}</Text>

            <Divider styleName="line" />

            <Row>
              <Icon name="laptop" />
              <View styleName="vertical">
                <Subtitle>Visit webpage</Subtitle>
                <Text numberOfLines={1}>{restaurant.url}</Text>
              </View>
              <Icon styleName="disclosure" name="right-arrow" />
            </Row>

            <Divider styleName="line" />

            <Row>
              <Icon name="pin" />
              <View styleName="vertical">
                <Subtitle>Address</Subtitle>
                <Text numberOfLines={1}>{restaurant.address}</Text>
              </View>
              <Icon styleName="disclosure" name="right-arrow" />
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
