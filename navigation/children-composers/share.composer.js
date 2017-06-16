import React from 'react';
import {
  View,
  ShareButton,
} from '../../index';

const ShareComposer = {
  canCompose(navBarProps) {
    const value = navBarProps.share;
    return (value && value.link);
  },
  compose(navBarProps) {
    const value = navBarProps.share;
    const { title, text, link } = value;

    return { renderRightComponent() {
      return (
        <View virtual styleName="container">
          <ShareButton
            animationName={navBarProps.animationName}
            title={title || navBarProps.title}
            message={text}
            url={link}
          />
        </View>
      );
    } };
  },
};

export default ShareComposer;
