import React, { Component } from 'react';
import {
  Image,
  ListView,
  Tile,
  Title,
  Subtitle,
  TouchableOpacity,
  Screen,
  Divider,
} from '@shoutem/ui';

import { connect } from 'react-redux';

class RestaurantsList extends Component {
  static navigationOptions = {
    title: 'All Restaurants',
  }

  static propTypes = {
    onButtonPress: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
  }

  getRestaurants() {
    return require('../assets/data/restaurants.json');
  }

  renderRow(restaurant) {
    const {navigation} = this.props;
    return (
      <TouchableOpacity onPress={() => navigation.navigate('RestaurantDetails', {restaurant})}>
        <Image
          styleName="large-banner"
          source={{ uri: restaurant.image.url }}
        >
          <Tile>
            <Title styleName="md-gutter-bottom">{restaurant.name}</Title>
            <Subtitle styleName="sm-gutter-horizontal">{restaurant.address}</Subtitle>
          </Tile>
        </Image>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <Screen>

        <ListView
          data={this.getRestaurants()}
          renderRow={restaurant => this.renderRow(restaurant)}
        />
      </Screen>
    );
  }
}

export default RestaurantsList;

