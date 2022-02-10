import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
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

const restaurants = require('../assets/data/restaurants.json');

class RestaurantsList extends PureComponent {
  static propTypes = {
    onButtonPress: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
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
            <Subtitle styleName="sm-gutter-horizontal">
              {restaurant.address}
            </Subtitle>
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
          data={restaurants}
          renderRow={restaurant => this.renderRow(restaurant)}
        />
      </Screen>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onButtonPress: restaurant => {
    dispatch(
      navigatePush(
        {
          key: 'RestaurantDetails',
          title: 'Details',
        },
        { restaurant },
      ),
    );
  },
});

export default connect(undefined, mapDispatchToProps)(RestaurantsList);
