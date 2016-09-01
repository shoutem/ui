import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import {
  Image,
  ListView,
  Tile,
  Title,
  Subtitle,
  TouchableOpacity,
  Screen,
} from '@shoutem/ui';
import { connect } from 'react-redux';
import { navigatePush } from './navigation/actions';

class RestaurantsList extends Component {
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
        <Image
          styleName="large-banner"
          source={{ uri: restaurant.image.url }}
        >
          <Tile>
            <Title styleName="md-gutter-bottom">{restaurant.name}</Title>
            <Subtitle styleName="sm-gutter-horizontal">{restaurant.address}</Subtitle>
          </Tile>
        </Image>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <ScrollView>
        <Screen style={{ marginTop: 70 }}>
          <ListView
            data={this.getRestaurants()}
            renderRow={restaurant => this.renderRow(restaurant)}
          />
        </Screen>
      </ScrollView>
    );
  }
}

RestaurantsList.propTypes = {
  onButtonPress: React.PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  onButtonPress: (restaurant) => {
    dispatch(navigatePush({ key: 'RestaurantDetails', title: 'Details' }, { restaurant }));
  },
});

export default connect(
	undefined,
	mapDispatchToProps
)(RestaurantsList);

