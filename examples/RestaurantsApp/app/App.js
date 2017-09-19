import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  CardStack,
  NavigationBar,
} from '@shoutem/ui/navigation';

import { navigatePop } from './redux';
import RestaurantsList from './RestaurantsList';
import RestaurantDetails from './RestaurantDetails';

class App extends Component {
  static propTypes = {
    onNavigateBack: PropTypes.func.isRequired,
    navigationState: PropTypes.object,
    scene: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.renderNavBar = this.renderNavBar.bind(this);
    this.renderScene = this.renderScene.bind(this);
  }

  renderScene(props) {
    const { route } = props.scene;

    let Screen = route.key === 'RestaurantDetails' ? RestaurantDetails : RestaurantsList;
    return (<Screen {...route.props} />);
  }

  renderNavBar(props) {
    const { onNavigateBack } = this.props;

    return (
      <NavigationBar.View
        {...props}
        onNavigateBack={onNavigateBack}
      />
    );
  }

  render() {
    const { navigationState, onNavigateBack } = this.props;

    return (
      <CardStack
        navigationState={navigationState}
        onNavigateBack={onNavigateBack}
        renderNavBar={this.renderNavBar}
        renderScene={this.renderScene}
      />
    );
  }
}

export default connect(
  state => ({ navigationState: state.navigationState }),
  { onNavigateBack: navigatePop }
)(App);
