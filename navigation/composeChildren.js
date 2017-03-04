import React, { Component } from 'react';
import Share from 'react-native-share';
import _ from 'lodash';

import {
  View,
  Button,
  ShareButton,
  Title,
  Icon,
} from '../index';

const composers = {
  title: (value, navBarProps) => ({
    renderTitleComponent() {
      return (
        <View virtual styleName="container">
          <Title animationName={navBarProps.animationName} numberOfLines={1}>
            {value || ''}
          </Title>
        </View>
      );
    },
  }),
  share: (value, navBarProps) => {
    if (!value.link) {
      return undefined;
    }

    const { title, text, link } = value;

    return {
      renderRightComponent() {
        return (
          <View virtual styleName="container">
            <ShareButton
              iconAnimation={navBarProps.animationName}
              title={title || navBarProps.title}
              message={text}
              url={link}
            />
          </View>
        );
      },
    };
  },
  scene: (value, navBarProps) => ({
    renderLeftComponent: (sceneProps) => {
      if (sceneProps.scene.index === 0 || !sceneProps.onNavigateBack) {
        return null;
      }

      return (
        <View virtual styleName="container">
          <Button onPress={sceneProps.onNavigateBack}>
            <Icon name="back" animationName={navBarProps.animationName} />
          </Button>
        </View>
      );
    },
  }),
};

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
    _.forEach(this.props, (value, key) => {
      if (_.isFunction(composers[key])) {
        _.assign(newProps, composers[key](value, this.props));
      }
    });

    return <NavigationBarComponent {..._.assignWith(newProps, this.props, skipUndefined)} />;
  }
};

export default composeChildren;
