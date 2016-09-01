import React, { Component } from 'react';

import { Button } from '../Button';
import { Title } from '../Text';
import { Icon } from '../Icon';

import Share from 'react-native-share';
import * as _ from 'lodash';

const composers = {
  title: (value, props) => ({
    centerComponent: (
      <Title animationName={props.animationName} numberOfLines={1}>
        {value || ''}
      </Title>
    ),
  }),
  share: (value, props) => {
    if (!value.link) {
      return;
    }

    const onShare = () =>
      Share.open({
        title: value.title || props.title,
        message: value.text,
        url: value.link,
      }, (sharingError) => {
        console.error(sharingError);
      });

    return {
      rightComponent: (
        <Button onPress={onShare}>
          <Icon name="share" />
        </Button>
      ),
    };
  },
  hasHistory: (value, props) => {
    const { navigateBack } = props;

    /**
     * onPress sets `event` as first param, which leads to ignoring default navigateBack
     * first argument (navigator) so we have to wrap navigateBack into function to leave first
     * argument empty, default
     */
    function navigateBackWithoutEventParameter() {
      navigateBack();
    }

    const leftComponent = value ? (
      <Button
        styleName="clear"
        onPress={navigateBackWithoutEventParameter}
      >
        <Icon name="back" />
      </Button>
    ) :
      null;

    return { leftComponent };
  },
};

/**
 * If source (usually state set by component) has undefined
 * property values, ignore those properties.
 * @param objValue
 * @param srcValue
 * @returns {*}
 */
function skipUndefined(objValue, srcValue) {
  return _.isUndefined(srcValue) ? objValue : srcValue;
}

// eslint-disable-next-line react/prefer-stateless-function
const composeChildren = NavigationBarComponent => class extends Component {
  render() {
    const newProps = {};
    _.forEach(this.props, (value, key) => {
      if (_.isFunction(composers[key])) {
        _.assign(newProps, composers[key](value, this.props));
      }
    });

    return <NavigationBarComponent {..._.assignWith(newProps, this.props, skipUndefined)} />;
  }
};

export default composeChildren;
