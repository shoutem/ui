import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '../View';
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
    // Sometimes, in web, svg icons are not resized as expected, unless svg is wrapped inside View.
    <View>
      <NamedIcon
        fill={color}
        width={width}
        height={height}
        style={{ ...otherStyle }}
        {...otherProps}
      />
    </View>
  );
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
};

export default connectStyle('shoutem.ui.Icon')(Icon);
