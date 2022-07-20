import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { CardStack, NavigationBar } from '@shoutem/ui/navigation';
import { navigatePop } from '../redux';
import RestaurantDetails from './RestaurantDetails';
import RestaurantsList from './RestaurantsList';

class Restaurants extends PureComponent {
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

Restaurants.propTypes = {
  onNavigateBack: PropTypes.func.isRequired,
  navigationState: PropTypes.object,
  scene: PropTypes.object,
};

Restaurants.defaultProps = {
  navigationState: undefined,
  scene: undefined,
};

export default connect(state => ({ navigationState: state.navigationState }), {
  onNavigateBack: navigatePop,
})(Restaurants);
