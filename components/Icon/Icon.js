import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { getIcon } from './services';

function Icon({ name, style, ...otherProps }) {
  const { color, width, height, ...otherStyle } = style;

  const NamedIcon = getIcon(name);

  if (!NamedIcon) {
    // eslint-disable-next-line no-console
    console.warn(`Icon with name '${name}' not found within the provided set`);

    return null;
  }

  return (
    <NamedIcon
      fill={color}
      width={width}
      height={height}
      style={{ ...otherStyle }}
      {...otherProps}
    />
  );
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  style: PropTypes.any,
};

export default connectStyle('shoutem.ui.Icon')(Icon);
