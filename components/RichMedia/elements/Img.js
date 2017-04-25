import React from 'react';
import RichMediaImage from '../components/RichMediaImage';
import { mapComponentProps, mapElementProps } from '../components/RichMedia';
import { connectStyle } from '@shoutem/theme';

function Img({ src }) {
  const source = { uri: src };

  return (
    <RichMediaImage
      source={source}
      style={{ resizeMode: 'contain', alignSelf: 'center' }}
    />
  );
}

Img.propTypes = {
  ...RichMediaImage.propTypes,
};

export default connectStyle('shoutem.ui.RichMedia.img')(mapComponentProps(mapElementProps)(Img));
