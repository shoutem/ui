import React from 'react';

import { ElementPropTypes } from '../Html';
import Image from '../components/Image';
import { combineMappers, mapElementProps } from '../Html';

function Img({ src, style, zoomable }) {
  const source = { uri: src };

  return (
    <Image
      source={source}
      style={style}
      zoomable={zoomable}
    />
  );
}

Img.propTypes = {
  ...Image.propTypes,
  ...ElementPropTypes,
};

export default combineMappers(mapElementProps)(Img);
