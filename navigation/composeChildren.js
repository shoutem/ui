import React, { Component } from 'react';
import _ from 'lodash';
import { Composers } from './children-composers';

/**
 * Merge customizer that ignores undefined values.
 * If source (usually state set by the component) has undefined
 * property values, ignore those properties.
 *
 * @param objValue The resulting object value.
 * @param srcValue The source object value.
 * @returns {*} The value to use in the result.
 */
function skipUndefined(objValue, srcValue) {
  return _.isUndefined(srcValue) ? objValue : srcValue;
}

// eslint-disable-next-line react/prefer-stateless-function
const composeChildren = NavigationBarComponent => class extends Component {
  render() {
    const newProps = {};
    _.forEach(Composers, (composer) => {
      if (composer.canCompose(this.props)) {
        const composerResult = composer.compose(this.props);
        if (composerResult) {
          _.assign(newProps, composerResult);
        }
      }
    });

    return <NavigationBarComponent {..._.assignWith(newProps, this.props, skipUndefined)} />;
  }
};

export default composeChildren;
