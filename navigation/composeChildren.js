import React, { Component } from 'react';
import _ from 'lodash';
import ChildrenComposers from './children-composers';

// eslint-disable-next-line react/prefer-stateless-function
const composeChildren = NavigationBarComponent => class extends Component {
  render() {
    _.forEach(ChildrenComposers, (composer) => {
      if (composer.canCompose(this.props)) {
        const composerResult = composer.compose(this.props);
        if (composerResult) {
          _.assign(this.props, composerResult);
        }
      }
    });
    return <NavigationBarComponent {...this.props} />;
  }
};

export default composeChildren;
