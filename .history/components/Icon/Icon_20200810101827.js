import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { connectStyle } from "@shoutem/theme";
import { Icons } from "./assets";

function IconSvg({ name, style, ...otherProps }) {
  const { color, fontSize, ...otherStyle } = style;

  const Icon = Icons[name];

  if (!Icon) {
    console.warn(`Icon with ${name} name not found within the provided set`);

    return null;
  }

  return (
    <Icon
      fill={color}
      width={fontSize}
      height={fontSize}
      style={{ ...otherStyle }}
      {...otherProps}
    />
  );
}

IconSvg.propTypes = {
  name: PropTypes.string.isRequired,
  iconProps: PropTypes.object,
  style: PropTypes.any,
};

export default connectStyle("shoutem.ui.Icon")(IconSvg);
