import React from 'react';

import { View } from '../../../components/View';
import { ElementPropTypes, combineMappers, mapElementProps } from '../../Html';
import renderItems from './helpers/renderItems';
import pickLiChildElements from './helpers/pickLiChildElements';
import Li from './Li';

export function Ul({ style, childElements, renderElement }) {
  // TODO (Braco) - handle list-style-type from inlineStyle prop
  const liItems = pickLiChildElements(childElements);
  return (
    <View style={style.container}>
      {renderItems(Li, liItems, renderElement)}
    </View>
  );
}

Ul.propTypes = {
  ...ElementPropTypes,
  style: React.PropTypes.object,
};

export default combineMappers(mapElementProps)(Ul);
