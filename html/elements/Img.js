import React from 'react';
import { ElementPropTypes } from '../RichMedia';
import RichMediaImage from '../components/RichMediaImage';
import { mapComponentProps, mapElementProps } from '../RichMedia';
import { connectStyle } from '@shoutem/theme';

function Img({ src, style }) {
  const source = { uri: src };

  return (
    <RichMediaImage
      source={source}
      style={style}
    />
  );
}

Img.propTypes = {
  ...RichMediaImage.propTypes,
  ...ElementPropTypes,
};

export default connectStyle('shoutem.ui.RichMedia.img')(mapComponentProps(mapElementProps)(Img));
