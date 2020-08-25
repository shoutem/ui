import PropTypes from 'prop-types';
import React from 'react';

import { View } from '../../../components/View';
import renderItems from './helpers/renderItems';
import pickLiChildElements from './helpers/pickLiChildElements';
import { ElementPropTypes, combineMappers, mapElementProps } from '../../Html';

function createNumberElement(index) {
  return {
    tag: 'number',
    attributes: {
      index,
    },
  };
}

export function Ol({
  style,
  childElements,
  renderElement,
}) {
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
};

Ol.defaultProps = {
  style: {},
};

export default combineMappers(mapElementProps)(Ol);
