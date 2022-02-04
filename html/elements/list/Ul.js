import React from 'react';
import PropTypes from 'prop-types';
import { View } from '../../../components/View';
import { combineMappers, ElementPropTypes, mapElementProps } from '../../Html';
import pickLiChildElements from './helpers/pickLiChildElements';
import renderItems from './helpers/renderItems';

function createBulletElement() {
  return { tag: 'bullet' };
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
