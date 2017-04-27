import React from 'react';
import { ElementPropTypes } from '../Html';
import Image from '../components/Image';
import { combineMappers, mapElementProps } from '../Html';
import { connectStyle } from '@shoutem/theme';

function Img({ src, style }) {
  const source = { uri: src };

  return (
    <Image
      source={source}
      style={style}
    />
  );
}

Img.propTypes = {
  ...Image.propTypes,
  ...ElementPropTypes,
};

export default connectStyle('shoutem.ui.Html.img')(combineMappers(mapElementProps)(Img));
