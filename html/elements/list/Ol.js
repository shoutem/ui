import React from 'react';
import PropTypes from 'prop-types';

import { View } from '../../../components/View';
import { Text } from '../../../components/Text';
import renderItems from './helpers/renderItems';
import pickLiChildElements from './helpers/pickLiChildElements';
import { ElementPropTypes, combineMappers, mapElementProps } from '../../Html';
import Li from './Li';

function createNumberElement(element, index) {
  return {
    tag: 'number',
    attributes: {
      index,
    },
  };
}

export function Ol({ style, childElements, type, renderElement }) {
  const liItems = pickLiChildElements(childElements);
  return (
    <View style={style.container}>
      {renderItems(liItems, renderElement, createNumberElement)}
    </View>
  );
}

Ol.propTypes = {
  ...ElementPropTypes,
  style: PropTypes.object,
  type: PropTypes.string,
};

export default combineMappers(mapElementProps)(Ol);
