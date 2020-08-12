import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { connectStyle } from "@shoutem/theme";
import { resolveIcon } from "./services";

function Icon({ name, style, ...otherProps }) {
  const { color, width, height, ...otherStyle } = style;

  const Icon = resolveIcon(name);

  if (!Icon) {
    console.warn(`Icon with ${name} name not found within the provided set`);

    return null;
  }

  return (
    <Icon
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
  iconProps: PropTypes.object,
  style: PropTypes.any,
};

export default connectStyle("shoutem.ui.Icon")(Icon);
