import React, { Component } from 'react';
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

export default class RestaurantDetails extends Component {
  render() {
    const { restaurant } = this.props;

    return (
      <Screen styleName="paper">
        <ScrollView>
          <Image
            animationName="hero"
            styleName="large-portrait hero"
            source={{ uri: restaurant.image && restaurant.image.url }}
            key={restaurant.name}
          >
            <Tile animationName="hero">
              <Title>{restaurant.name}</Title>
              <Subtitle>{restaurant.address}</Subtitle>
            </Tile>
          </Image>

          <Screen styleName="paper">
            <Text styleName="md-gutter">{restaurant.description}</Text>

            <Divider styleName="line" />

            <Row>
              <Icon name="laptop" />
              <View styleName="vertical">
                <Subtitle>Visit webpage</Subtitle>
                <Text>{restaurant.url}</Text>
              </View>
              <Icon name="right-arrow" />
            </Row>

            <Divider styleName="line" />

            <Row>
              <Icon name="pin" />
              <View styleName="vertical">
                <Subtitle>Address</Subtitle>
                <Text>{restaurant.address}</Text>
              </View>
              <Icon name="right-arrow" />
            </Row>

            <Divider styleName="line" />

            <Row>
              <Icon name="email" />
              <View styleName="vertical">
                <Subtitle>Email</Subtitle>
                <Text>{restaurant.mail}</Text>
              </View>
            </Row>

            <Divider styleName="line" />
          </Screen>
        </ScrollView>
      </Screen>
    );
  }
}

RestaurantDetails.propTypes = {
  restaurant: React.PropTypes.object,
};
