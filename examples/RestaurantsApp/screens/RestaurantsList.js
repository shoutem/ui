import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import {
  ImageBackground,
  ListView,
  Tile,
  Title,
  Subtitle,
  TouchableOpacity,
  Screen,
  Divider,
} from '@shoutem/ui';

import { NavigationBar } from 'shoutem.navigation';

import { navigatePush } from '../redux';

class RestaurantsList extends PureComponent {
  static propTypes = {
    onButtonPress: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
  }

  getRestaurants() {
    return require('../assets/data/restaurants.json');
  }

  renderRow(restaurant) {
    const { onButtonPress } = this.props;

    return (
      <TouchableOpacity onPress={() => onButtonPress(restaurant)}>
        <ImageBackground
          styleName="large-banner"
          source={{ uri: restaurant.image.url }}
        >
          <Tile>
            <Title styleName="md-gutter-bottom">{restaurant.name}</Title>
            <Subtitle styleName="sm-gutter-horizontal">{restaurant.address}</Subtitle>
          </Tile>
        </ImageBackground>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <Screen>
        <NavigationBar title="All Restaurants" />
        <ListView
          data={this.getRestaurants()}
          renderRow={restaurant => this.renderRow(restaurant)}
        />
      </Screen>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  onButtonPress: (restaurant) => {
    dispatch(navigatePush({
      key: 'RestaurantDetails',
      title: 'Details',
    }, { restaurant }));
  },
});

export default connect(
	undefined,
	mapDispatchToProps
)(RestaurantsList);
