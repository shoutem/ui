import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBind from 'auto-bind/react';

import { CardStack, NavigationBar } from '@shoutem/ui/navigation';

import RestaurantsList from './RestaurantsList';
import RestaurantDetails from './RestaurantDetails';
import { navigatePop } from '../redux';

function renderScene(props) {
  const { scene: { route } } = props;

  const Screen = route.key === 'RestaurantDetails' ? RestaurantDetails : RestaurantsList;

  return (<Screen {...route.props} />);
}

renderScene.propTypes = {
  scene: PropTypes.object,
};

renderScene.defaultProps = {
  scene: undefined,
};

class Restaurants extends PureComponent {
  static propTypes = {
    onNavigateBack: PropTypes.func.isRequired,
    navigationState: PropTypes.object,
    scene: PropTypes.object,
  };

  static defaultProps = {
    navigationState: undefined,
    scene: undefined,
  };

  constructor(props) {
    super(props);

    autoBind(this);
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
        renderScene={renderScene}
      />
    );
  }
}

export default connect(
  state => ({ navigationState: state.navigationState }),
  { onNavigateBack: navigatePop },
)(Restaurants);
