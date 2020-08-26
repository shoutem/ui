import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBind from 'auto-bind/react';

import {
  Divider,
  ImageBackground,
  ListView,
  Screen,
  Subtitle,
  Tile,
  Title,
  TouchableOpacity,
} from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';

import { navigatePush } from '../redux';

function getRestaurants() {
  return require('../assets/data/restaurants.json');
}


class RestaurantsList extends PureComponent {
  static propTypes = {
    onButtonPress: PropTypes.func,
  };

  static defaultProps = {
    onButtonPress: undefined,
  };

  constructor(props) {
    super(props);

    autoBind(this);
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
          data={getRestaurants()}
          renderRow={restaurant => this.renderRow(restaurant)}
        />
      </Screen>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onButtonPress: (restaurant) => {
    dispatch(navigatePush({
      key: 'RestaurantDetails',
      title: 'Details',
    }, { restaurant }));
  },
});

export default connect(
  undefined,
  mapDispatchToProps,
)(RestaurantsList);
