import React from 'react';
import createIcon from './createIcon';

const RubiconIcon = createIcon('rubicon-icon-font');

const icons = {
  Default: null,
  Fallback: RubiconIcon,
};

function Icon(props) {
  const DefaultIcon = icons.Default || icons.Fallback;
  return (<DefaultIcon {...props} />);
}

Icon.setIconFont = fontFamily => {
  icons.Default = createIcon(fontFamily);
};

export {
  Icon,
  createIcon,
};
