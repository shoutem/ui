import React from 'react';
import { Video } from '../Video';

function isVideoNode(node) {
  return node.name === 'video' && !!node.attribs && !!node.attribs.src;
}

function transformVideoTag(node, style) {
  if (!isVideoNode(node)) {
    return null;
  }

  return (
    <Video
      style={style.video}
      source={{ uri: node.attribs.src }}
      height={style.video.height}
    />);
}

export default transformVideoTag;

