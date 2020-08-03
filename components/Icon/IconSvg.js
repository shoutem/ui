import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { gutter } from '~/modules/theme';
import { Icons } from './assets';
import { ButtonLabel } from './Texts';

function IconSvg ({ iconName, iconProps, title, style, labelStyle, ...otherProps }) {
    const Icon = Icons[iconName];

    if (!Icon) {
      console.warn(
        `Icon with ${iconName} name not found within the provided set`,
      );

      return null;
    }

    return (
      <TouchableOpacity
        style={[title && styles.flexButton, styles.button, style]}
        hitSlop={{
          top: gutter.large,
          right: gutter.large,
          bottom: gutter.large,
          left: gutter.large,
        }}
        {...otherProps}>
        <Icon {...iconProps} />
        {title && <ButtonLabel labelStyle={labelStyle}>{title}</ButtonLabel>}
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  flexButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    paddingVertical: gutter.regular,
    paddingHorizontal: gutter.regular,
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
