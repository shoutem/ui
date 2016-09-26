import React from 'react';
import { Lightbox } from '../../index';
import { Image } from '../Image';

function isImageNode(node) {
  return node.name === 'img' && !!node.attribs && !!node.attribs.src;
}

function transformImageTag(node, style) {
  if (!isImageNode(node)) {
    return null;
  }

  return (
    <Lightbox
      activeProps={{
        styleName: 'preview',
      }}
    >
      <Image
        style={style.img}
        source={{ uri: node.attribs.src }}
      />
    </Lightbox>
  );
}

export default transformImageTag;

