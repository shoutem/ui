import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@shoutem/ui';

import { View } from '../../../components/View';
import { ElementPropTypes, combineMappers, mapElementProps } from '../../Html';
import renderItems from './helpers/renderItems';
import pickLiChildElements from './helpers/pickLiChildElements';
import Li from './Li';

function createBulletElement(element, index) {
  return {
    tag: 'bullet',
  };
}

export function Ul({ style, childElements, renderElement }) {
  // TODO (Braco) - handle list-style-type from inlineStyle prop
  const liItems = pickLiChildElements(childElements);
  return (
    <View style={style.container}>
      {renderItems(liItems, renderElement, createBulletElement)}
    </View>
  );
}

Ul.propTypes = {
  ...ElementPropTypes,
  style: PropTypes.object,
};

export default combineMappers(mapElementProps)(Ul);
