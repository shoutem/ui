import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CardStack, NavigationBar } from '@shoutem/ui/navigation';
import RestaurantDetails from './RestaurantDetails';
import RestaurantsList from './RestaurantsList';
import { navigatePop } from '../redux';

class Restaurants extends PureComponent {
  static propTypes = {
    onNavigateBack: PropTypes.func.isRequired,
    navigationState: PropTypes.object,
    scene: PropTypes.object,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  renderScene(props) {
    const { route } = props.scene;

    const Screen =
      route.key === 'RestaurantDetails' ? RestaurantDetails : RestaurantsList;

    return <Screen {...route.props} />;
  }

  renderNavBar(props) {
    const { onNavigateBack } = this.props;

    return <NavigationBar.View {...props} onNavigateBack={onNavigateBack} />;
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

export default connect(state => ({ navigationState: state.navigationState }), {
  onNavigateBack: navigatePop,
})(Restaurants);
