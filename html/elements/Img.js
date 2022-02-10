import React from 'react';
import _ from 'lodash';
import Image from '../components/Image';
import { combineMappers, ElementPropTypes, mapElementProps } from '../Html';

export function isImg(element) {
  return _.get(element, 'tag') === 'img';
}

function Img({ src, style, lightbox }) {
  const source = { uri: src };
  const imgStyle = {
    ...style,
    resizeMode: 'contain',
  };

  return <Image source={source} style={imgStyle} lightbox={lightbox} />;
}

Img.propTypes = {
  ...Image.propTypes,
  ...ElementPropTypes,
};

export default combineMappers(mapElementProps)(Img);
