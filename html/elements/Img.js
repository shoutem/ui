import React from 'react';
import _ from 'lodash';

import { ElementPropTypes } from '../Html';
import Image from '../components/Image';
import { combineMappers, mapElementProps } from '../Html';

export function isImg(element) {
  return _.get(element, 'tag') === 'img';
}

function Img({ src, style, lightbox }) {
  const source = { uri: src };

  return (
    <Image
      source={source}
      style={style}
      lightbox={lightbox}
    />
  );
}

Img.propTypes = {
  ...Image.propTypes,
  ...ElementPropTypes,
};

export default combineMappers(mapElementProps)(Img);
