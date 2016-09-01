import React, { Component } from 'react';
import { NavigationExperimental } from 'react-native';
import {
  NavigationBar,
  Title,
  Button,
  Icon,
  View,
} from '@shoutem/ui';
import { connect } from 'react-redux';

import { navigatePop } from './navigation/actions';
import RestaurantsList from './RestaurantsList';
import RestaurantDetails from './RestaurantDetails';

const {
	Transitioner: NavigationTransitioner,
	Card: NavigationCard,
} = NavigationExperimental;

// Stylenames for navigation bar depend on which scene is rendered
const styles = {
  navigationBar: 'container',
};

class App extends Component {
  renderScene(props) {
    const { route } = props.scene;

    switch (route.key) {
      case 'RestaurantsList':
        styles.navigationBar = 'container';
        return <RestaurantsList />;
      case 'RestaurantDetails':
        styles.navigationBar = 'container';
        return <RestaurantDetails {...route.props} />;
      default:
        return <RestaurantsList />;
    }
  }

  render() {
    const { navigationState, backAction } = this.props;

    return (
      <NavigationTransitioner
        navigationState={navigationState}
        render={props => {
          const title = <Title numberOfLines={1}>{props.scene.route.title}</Title>;

          return (
            <View styleName="flexible">
              <NavigationCard
                {...props}
                renderScene={this.renderScene}
                key={props.scene.route.key}
              />
              <NavigationBar
                centerComponent={title}
                styleName={styles.navigationBar}
                leftComponent={
                  props.scene.index === 0 ? null :
                    <Button onPress={backAction}>
                      <Icon name="back" />
                    </Button>
                }
              />
            </View>
          );
        }}
      />
    );
  }
}

App.propTypes = {
  backAction: React.PropTypes.func.isRequired,
  navigationState: React.PropTypes.object,
  scene: React.PropTypes.object,
};

export default connect(
  state => ({
    navigationState: state.navigationState,
  }),
  dispatch => ({
    backAction: () => {
      dispatch(navigatePop());
    },
  })
)(App);
