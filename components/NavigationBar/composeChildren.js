import React, { PureComponent } from 'react';

import { Button } from '../Button';
import { Title } from '../Text';
import { Icon } from '../Icon';
import { ShareButton } from '../ShareButton';

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

    const { title, text, link } = value;

    return {
      rightComponent: (
        <ShareButton
          animationName={props.animationName}
          title={title || props.title}
          message={text}
          url={link}
        />
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
        <Icon
          name="back"
          animationName={props.animationName}
        />
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
const composeChildren = NavigationBarComponent => class extends PureComponent {
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
