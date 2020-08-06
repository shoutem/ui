import React from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, StyleSheet } from "react-native";
import _ from "lodash";
import { Icons } from "./assets";

function IconSvg({
  iconName,
  iconProps,
  title,
  style,
  labelStyle,
  ...otherProps
}) {
  const Icon = Icons[iconName];

  if (!Icon) {
    console.warn(
      `Icon with ${iconName} name not found within the provided set`
    );

    return null;
  }

  return (
    <TouchableOpacity
      style={[title && styles.flexButton, styles.button, style]}
      {...otherProps}
    >
      <Icon {...iconProps} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  flexButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    opacity: 1,
  },
});

IconSvg.propTypes = {
  title: PropTypes.string,
  iconName: PropTypes.string.isRequired,
  iconProps: PropTypes.object,
  style: PropTypes.any,
  labelStyle: PropTypes.any,
};

export default IconSvg;
