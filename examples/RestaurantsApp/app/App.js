import React, { Component } from 'react';
import { connect } from 'react-redux';

import {StackNavigator} from 'react-navigation';

import RestaurantsList from './RestaurantsList';
import RestaurantDetails from './RestaurantDetails';

const Navigator = StackNavigator({
  RestaurantsList: {
    screen: RestaurantsList,
  },
  RestaurantDetails: {
    screen: RestaurantDetails,
  }
},{
  initialRouteName: 'RestaurantsList',
});

class App extends Component {

  render() {
    return (
      <Navigator />
    );
  }
}

export default App;
