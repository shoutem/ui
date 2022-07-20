import React from 'react';
import PropTypes from 'prop-types';
import { View } from '../../../components/View';
import { combineMappers, ElementPropTypes, mapElementProps } from '../../Html';
import pickLiChildElements from './helpers/pickLiChildElements';
import renderItems from './helpers/renderItems';

function createNumberElement(index) {
  return {
    tag: 'number',
    attributes: {
      index,
    },
  };
}

export function Ol({ style, childElements, renderElement }) {
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
