import React, { Component } from 'react';
import _ from 'lodash';
import ChildrenComposers from './children-composers';

// eslint-disable-next-line react/prefer-stateless-function
const composeChildren = NavigationBarComponent => class extends Component {
  render() {
    ChildrenComposers
      .filter(composer => composer.canCompose(this.props))
      .map(composer => composer.compose(this.props))
      .reduce(_.assign, this.props);

    return <NavigationBarComponent {...this.props} />;
  }
};

export default composeChildren;
