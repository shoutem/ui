import React, { Component } from 'react';
import _ from 'lodash';
import ChildrenComposers from './children-composers';

// eslint-disable-next-line react/prefer-stateless-function
const composeChildren = NavigationBarComponent => class extends Component {
  render() {
    const newProps = {};
    ChildrenComposers
      .filter(composer => composer.canCompose(this.props))
      .map(composer => composer.compose(this.props))
      .reduce(_.assign, newProps);

    return <NavigationBarComponent {..._.assign(newProps, this.props)} />;
  }
};

export default composeChildren;
